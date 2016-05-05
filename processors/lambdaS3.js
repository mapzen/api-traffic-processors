/* eslint consistent-return: 0 */

var AWS = require('aws-sdk');

var s3 = new AWS.S3();

module.exports = function (config) {
  var parsers = config.parsers;
  var formatter = config.formatter;
  var exporter = config.exporter;

  return function handler(event, context, callback) {
    var srcBucket = event.Records[0].s3.bucket.name;
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    var keyComponents = srcKey.split('/');
    var service = keyComponents[keyComponents.length - 2];
    var parser = parsers[service];
    if (!parser) return callback(new Error('no parser for: ' + service));

    console.log('fetching ' + srcKey);
    s3.getObject({ Bucket: srcBucket, Key: srcKey }, function getS3Object(err, data) {
      if (err) return callback(err);
      var lines = data.Body.toString().split('\n');
      console.log('retrieved ' + lines.length + ' lines');
      var formatted = [];
      lines.forEach(function (line) {
        if (!line) return;
        formatted.push(formatter(parser(line)));
      });
      exporter.addBatch(formatted);
      callback();
    });
  };
};
