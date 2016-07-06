/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

function stubFirehose(works) {
  var putRecord = works
                  ? sinon.stub().callsArg(1, null, {})
                  : sinon.stub().callsArgWith(1, new Error('intentional error'));
  var putRecordBatch = works
                       ? sinon.stub().callsArgWith(1, null, {})
                       : sinon.stub().callsArgWith(1, new Error('intentional error'));

  return {
    Firehose: sinon.stub().returns({ putRecord: putRecord, putRecordBatch: putRecordBatch }),
    putRecord: putRecord,
    putRecordBatch: putRecordBatch
  };
}

describe('kinesisExporter', function () {
  describe('add', function () {
    var clock;
    beforeEach(function () { clock = sinon.useFakeTimers(); });
    afterEach(function () { clock.restore(); });

    it('sends after .1 seconds', function () {
      var stubs = stubFirehose(true);
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      exporter.add('payload');
      clock.tick(99);
      expect(stubs.putRecordBatch.callCount).to.eq(0);
      clock.tick(1);
      expect(stubs.putRecordBatch.callCount).to.eq(1);
      expect(stubs.putRecordBatch.firstCall.args[0]).to.deep.equal({
        DeliveryStreamName: 'teststream',
        Records: [{ Data: 'payload\n' }]
      });
    });

    it('sends after 500 adds', function () {
      var stubs = stubFirehose(true);
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      for (var i = 0; i < 499; i++) {
        exporter.add('payload');
      }
      expect(stubs.putRecordBatch.called).to.be.false;
      exporter.add('payload');
      expect(stubs.putRecordBatch.called).to.be.true;
      expect(stubs.putRecordBatch.firstCall.args[0].Records.length).to.eq(500);
    });

    it('retries batch at expected intervals', function () {
      var stubs = stubFirehose(false);
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      exporter.add('payload');
      clock.tick(100);
      expect(stubs.putRecordBatch.callCount).to.eq(1);
      clock.tick(99);
      expect(stubs.putRecordBatch.callCount).to.eq(1);
      clock.tick(1);
      expect(stubs.putRecordBatch.callCount).to.eq(2);

      clock.tick(999);
      expect(stubs.putRecordBatch.callCount).to.eq(2);
      clock.tick(1);
      expect(stubs.putRecordBatch.callCount).to.eq(3);

      clock.tick(9999);
      expect(stubs.putRecordBatch.callCount).to.eq(3);
      clock.tick(1);
      expect(stubs.putRecordBatch.callCount).to.eq(4);

      clock.tick(119999);
      expect(stubs.putRecordBatch.callCount).to.eq(4);
      clock.tick(1);
      expect(stubs.putRecordBatch.callCount).to.eq(5);

      clock.tick(299999);
      expect(stubs.putRecordBatch.callCount).to.eq(5);
      clock.tick(1);
      expect(stubs.putRecordBatch.callCount).to.eq(6);

      clock.tick(1000000000);
      expect(stubs.putRecordBatch.callCount).to.eq(6);
    });
  });

  describe('addBatch', function () {
    it('produces correct output', function () {
      var stubs = stubFirehose(true);
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      exporter.addBatch(['payload'], function (err) {
        expect(err).to.not.exist;
        expect(stubs.putRecordBatch.firstCall.args[0]).to.deep.equal({
          DeliveryStreamName: 'teststream',
          Records: [{ Data: 'payload\n' }]
        });
      });
    });

    it('sends in batches of 500', function () {
      var stubs = stubFirehose(true);
      var KinesisExporter = proxyquire('../../exporters/kinesisExporter.js', {
        'aws-sdk': { Firehose: stubs.Firehose }
      });
      var exporter = new KinesisExporter({ region: 'oz', streamName: 'teststream' });

      var rows = [];
      for (var i = 0; i < 501; i++) {
        rows.push('a');
      }

      exporter.addBatch(rows, function (err) {
        expect(err).to.not.exist;
        expect(stubs.putRecordBatch.firstCall.args[0].Records.length).to.equal(500);
        expect(stubs.putRecordBatch.secondCall.args[0]).to.deep.equal({
          DeliveryStreamName: 'teststream',
          Records: [{ Data: 'a\n' }]
        });
        expect(stubs.putRecordBatch.calledTwice).to.be.true;
      });
    });
  });
});
