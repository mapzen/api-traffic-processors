var AWS = require('aws-sdk');

var s3 = new AWS.S3();

module.exports = function (config) {
  var parser = config.parser;
  var formatter = config.formatter;
  var exporter = config.exporter;

  return function handler(event, context, callback) {
    var srcBucket = event.Records[0].s3.bucket.name;
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    s3.getObject({ Bucket: srcBucket, Key: srcKey }, function getS3Object(err, data) {
      if (err) return callback(err);
      var lines = data.Body.toString().split('\n');
      lines.forEach(function (line) {
        if (!line) return;
        exporter.add(formatter(parser(line)));
      });
      return callback(null, lines[0]);
    });
  };
};
