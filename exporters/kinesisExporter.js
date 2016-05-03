var AWS = require('aws-sdk');

module.exports = function (args) {
  var kinesis = new AWS.Firehose({ region: args.region });

  this.add = function (payload) {
    var params;
    try {
      params = {
        Record: {
          Data: payload + '\n'
        },
        DeliveryStreamName: args.streamName
      };
      kinesis.putRecord(params, function (err) {
        if (err) console.log('firehose err: ', err);
      });
    } catch (err) {
      console.log('failed to send record. ', err);
    }
  };
};
