var AWS = require('aws-sdk');

module.exports = function(streamName) {
  var kinesis = new AWS.Firehose();

  this.add = function(payload) {
    try {
      var params = {
        Record: payload,
        DeliveryStreamName: streamName,
      };
      console.log("sending to kinesis firehose: ", params);
      kinesis.putRecord(params, function(err, data) {
        if (err) console.log("firehose err: ", err);
        else console.log("firehose result: ", data);
      });
      batchedRequests.length = 0;
    } catch (err) {
      console.log('failed to send record. ', err);
    }
  };
};
