/* eslint consistent-return: 0 */

var AWS = require('aws-sdk');

var s3 = new AWS.S3();

module.exports = function (config) {
  var parsers = config.parsers;
  var formatter = config.formatter;
  var exporter = config.exporter;

  return function handler(event, context, callback) {
    Error.stackTraceLimit = 3;

    var srcBucket = event.Records[0].s3.bucket.name;
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    var keyComponents = srcKey.split('/');
    var service = keyComponents[keyComponents.length - 2];
    var parser = parsers[service];
    if (!parser) {
      return callback(new Error('Error: no parser for ' + service + '\nS3Key: ' + srcKey));
    }

    s3.getObject({ Bucket: srcBucket, Key: srcKey }, function getS3Object(err, data) {
      if (err) {
        return callback(new Error('Error: s3 get failed for ' + srcKey + '\n' + err.message));
      }
      var lines = data.Body.toString().split('\n');
      var formatted = [];
      lines.forEach(function (line) {
        if (!line) return;
        formatted.push(formatter(parser(line)));
      });
      exporter.addBatch(formatted, function (exporterr) {
        if (exporterr) {
          var newerr = new Error('Error: exporter.addBatch failed for ' + srcKey +
                                 '\n' + exporterr.message);
          newerr.stack = exporterr.stack + '\n' + newerr.stack;
          return callback(newerr);
        }
        callback(null);
      });
    });
  };
};
