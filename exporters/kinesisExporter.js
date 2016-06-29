/* eslint consistent-return: 0, no-loop-func: 0 */

var AWS = require('aws-sdk');

function prepareRecord(data) {
  return { Data: data + '\n' };
}

module.exports = function (args) {
  var firehose = new AWS.Firehose({ region: args.region });

  this.add = function (record, callback) {
    var params = {
      Record: prepareRecord(record),
      DeliveryStreamName: args.streamName
    };
    firehose.putRecord(params, function (err, data) {
      if (err) return callback(new Error('firehose err: ' + err + data));
      callback(null, 'sent record');
    });
  };

  this.addBatch = function (records, callback) {
    var batch = records.map(prepareRecord);

    function sendBatch(start) {
      var curslice = batch.slice(start, start + 500);
      var params = {
        Records: curslice,
        DeliveryStreamName: args.streamName
      };
      firehose.putRecordBatch(params, function (err, response) {
        if (err) return callback(new Error('firehose err: ' + err + response));
        if (response.FailedPutCount > 0) {
          return callback(new Error('failed to send ' + response.FailedPutCount + ' of ' +
                                    curslice.length + ' records. ', response));
        }

        if (start + 500 < batch.length) {
          sendBatch(start + 500);
        } else {
          callback(null, 'sent ' + batch.length + ' records');
        }
      });
    }

    sendBatch(0);
  };
};
