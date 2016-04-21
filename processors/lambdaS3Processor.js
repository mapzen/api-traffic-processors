var AWS = require('aws-sdk');
// var KinesisExporter = require('../exporters/kinesisExporter.js');
// var peliasParser = require('../parsers/fastlyPeliasParser.js');
// var vectorParser = require('../parsers/fastlyVectorarser.js');
// var formatter = require('../formatters/trafficSpaces.js');

var s3 = new AWS.S3();

exports.handler = function handler(event, context, callback) {
  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  s3.getObject({ Bucket: srcBucket, Key: srcKey }, function getS3Object(err, data) {
    var lines;
    if (err) return callback(err);
    lines = data.Body.toString().split('\n');
    console.log(lines);
    return callback(null, lines[0]);
  });
};
