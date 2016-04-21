var AWS = require('aws-sdk');

module.exports = function (streamName) {
  var kinesis = new AWS.Firehose();

  this.add = function (payload) {
    var params;
    try {
      params = {
        Record: {
          Data: payload
        },
        DeliveryStreamName: streamName
      };
      console.log('sending to kinesis firehose: ', params);
      kinesis.putRecord(params, function (err, data) {
        if (err) console.log('firehose err: ', err);
        else console.log('firehose result: ', data);
      });
    } catch (err) {
      console.log('failed to send record. ', err);
    }
  };
};
