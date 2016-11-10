/* eslint consistent-return: 0 */

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

function parseS3EventRecord(record) {
  var key;
  var keyComponents;
  try {
    key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    keyComponents = key.split('/');
  } catch (err) {
    // couldn't parse uricomponent
    key = null;
    keyComponents = [];
  }
  return {
    bucket: record.s3.bucket.name,
    key: key,
    service: keyComponents[keyComponents.length - 2],
    filename: keyComponents[keyComponents.length - 1]
  };
}

function pauseHandler(config, event, context, callback) {
  Error.stackTraceLimit = 3;
  event.Records.forEach(function (s3Record) {
    var parsedS3 = parseS3EventRecord(s3Record);
    s3.copyObject({
      Bucket: config.pauseBucket,
      CopySource: parsedS3.bucket + '/' + s3Record.s3.object.key,
      Key: config.pausePrefix + '/' + parsedS3.service + '/' + parsedS3.filename
    }, function (copyerr) {
      if (copyerr) {
        return callback(new Error('Error: s3 copy failed for ' + parsedS3.key +
                                  '\n' + copyerr.message));
      }
      s3.deleteObject({
        Bucket: parsedS3.bucket,
        Key: parsedS3.key
      }, function (deleteerr) {
        if (deleteerr) {
          console.error('Error: s3 delete failed for ' + parsedS3.key + '\n' + deleteerr.message);
        }
        // callback(null) not needed because of how lambda works
      });
    });
  });
}

function handler(config, event, context, callback) {
  Error.stackTraceLimit = 3;
  event.Records.forEach(function (s3Record) {
    var parsedS3 = parseS3EventRecord(s3Record);
    if (!config[parsedS3.service]) {
      return console.error('Error: no handler for ' + parsedS3.service +
                           '\nS3Key: ' + parsedS3.key);
    }
    var parser = config[parsedS3.service].parser;
    var outputs = config[parsedS3.service].outputs;

    s3.getObject({ Bucket: parsedS3.bucket, Key: parsedS3.key }, function getS3Object(err, data) {
      if (err) {
        return callback(new Error('Error: s3 get failed for ' + parsedS3.key + '\n' + err.message));
      }
      var lines = data.Body.toString().split('\n');
      var parsed = [];
      lines.forEach(function (line) {
        if (!line) return;
        parsed.push(parser(line));
      });

      outputs.forEach(function (output) {
        var formatted = parsed.map(output.formatter);
        output.exporter.addBatch(formatted, function (exporterr) {
          if (exporterr) {
            var newerr = new Error('Error: exporter.addBatch failed for ' + parsedS3.key +
                                   '\n' + exporterr.message);
            newerr.stack = exporterr.stack + '\n' + newerr.stack;
            return callback(newerr);
          }
          // callback(null) not needed because of how lambda works
        });
      });
    });
  });
}

module.exports = function (config) {
  if (config.pause) return pauseHandler.bind(null, config);
  return handler.bind(null, config);
};
