/* eslint consistent-return: 0, no-loop-func: 0 */

var AWS = require('aws-sdk');

function prepareRecord(data) {
  return { Data: data + '\n' };
}

module.exports = function (args) {
  var firehose = new AWS.Firehose({ region: args.region });

  this.add = function (record) {
    var params = {
      Record: prepareRecord(record),
      DeliveryStreamName: args.streamName
    };
    firehose.putRecord(params, function (err, data) {
      if (err) {
        console.error('firehose err: ', err, data);
      }
    });
  };

  this.addBatch = function (records) {
    var batch = records.map(prepareRecord);
    for (var i = 0; i < batch.length; i += 500) {
      var curslice = batch.slice(i, i + 500);
      var params = {
        Records: curslice,
        DeliveryStreamName: args.streamName
      };
      firehose.putRecordBatch(params, function (err, response) {
        if (err) return console.error('firehose err: ', err, response);
        if (response.FailedPutCount > 0) {
          return console.error(
            'failed to send ' + response.FailedPutCount + ' of ' +
            curslice.length + ' records. ', response);
        }
        console.log('sent ' + curslice.length + ' records');
      });
    }
  };
};
