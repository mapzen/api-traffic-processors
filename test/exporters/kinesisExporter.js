/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

function stubFirehose(fails) {
  var putRecord = fails
                  ? sinon.stub().callsArgWith(1, new Error('intentional error'))
                  : sinon.stub().callsArg(1, null, {});
  var putRecordBatch = fails
                       ? sinon.stub().callsArgWith(1, new Error('intentional error'))
                       : sinon.stub().callsArgWith(1, null, {});

  return {
    Firehose: sinon.stub().returns({ putRecord: putRecord, putRecordBatch: putRecordBatch }),
    putRecord: putRecord,
    putRecordBatch: putRecordBatch
  };
}

describe('kinesisExporter', function () {
  describe('add', function () {
    it('produces correct output', function () {
      var stubs = stubFirehose();
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      exporter.add('payload');
      expect(stubs.putRecord.firstCall.args[0]).to.deep.equal({
        DeliveryStreamName: 'teststream',
        Record: { Data: 'payload\n' }
      });
    });
  });

  describe('addBatch', function () {
    it('produces correct output', function () {
      var stubs = stubFirehose();
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      exporter.addBatch(['payload']);
      expect(stubs.putRecordBatch.firstCall.args[0]).to.deep.equal({
        DeliveryStreamName: 'teststream',
        Records: [{ Data: 'payload\n' }]
      });
    });

    it('sends in batches of 500', function () {
      var stubs = stubFirehose();
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      var rows = [];
      for (var i = 0; i < 501; i++) {
        rows.push('a');
      }

      exporter.addBatch(rows);
      expect(stubs.putRecordBatch.firstCall.args[0].Records.length).to.equal(500);
      expect(stubs.putRecordBatch.secondCall.args[0]).to.deep.equal({
        DeliveryStreamName: 'teststream',
        Records: [{ Data: 'a\n' }]
      });
      expect(stubs.putRecordBatch.calledTwice).to.be.true;
    });
  });
});
