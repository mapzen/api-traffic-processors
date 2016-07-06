/* eslint consistent-return: 0, no-loop-func: 0, no-use-before-define: 0 */

var AWS = require('aws-sdk');

function prepareRecord(data) {
  return { Data: data + '\n' };
}

var retryDelay = [100, 1000, 10000, 120000, 300000];

module.exports = function (args) {
  var firehose = new AWS.Firehose({ region: args.region });
  var queue = [];
  var timerId;

  function send() {
    if (queue.length === 0) return;
    for (var i = 0; i < queue.length; i += 500) {
      sendBatch(queue.slice(i, i + 500), 0);
    }
    queue.length = 0;

    function sendBatch(batch, retries) {
      var params = {
        Records: batch,
        DeliveryStreamName: args.streamName
      };
      firehose.putRecordBatch(params, function (err, response) {
        if (err || response.FailedPutCount > 0) {
          console.error('firehose error ' + (retries + 1) + ': ' + err + response);
          if (retries < retryDelay.length) {
            setTimeout(sendBatch.bind(null, batch, retries + 1), retryDelay[retries]);
          }
        }
      });
    }
  }

  // add one record to the queue. handles batching and retries.
  this.add = function (record) {
    queue.push(prepareRecord(record));
    if (queue.length >= 500) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      send();
    } else if (!timerId) {
      timerId = setTimeout(send, 100);
    }
  };

  // immediately send batch of records. doesn't handle retries.
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
