/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

function stubFirehose(fails) {
  var putRecord = fails
                  ? sinon.stub().callsArgWith(1, new Error('intentional error'))
                  : sinon.stub().callsArg(1);

  return {
    Firehose: sinon.stub().returns({ putRecord: putRecord }),
    putRecord: putRecord
  };
}

describe('kinesisExporter', function () {
  it('runs without errors', function () {
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
