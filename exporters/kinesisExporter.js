var AWS = require('aws-sdk');

module.exports = function (streamName, region) {
  var kinesis = new AWS.Firehose({ region: region });

  this.add = function (payload) {
    var params;
    try {
      params = {
        Record: {
          Data: payload + '\n'
        },
        DeliveryStreamName: streamName
      };
      kinesis.putRecord(params, function (err) {
        if (err) console.log('firehose err: ', err);
      });
    } catch (err) {
      console.log('failed to send record. ', err);
    }
  };
};
