/* eslint-env mocha */
/* eslint no-unused-expressions: 0, max-len: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('apiaxleKinesis', function () {
  it('calls everything correctly', function (done) {
    var exporteradd = sinon.stub();
    var exporter = sinon.stub().returns({ add: exporteradd });
    var parser = sinon.stub().returns({ api: 'valhalla' });
    var formatter = sinon.stub().returns('formatted');
    var ApiaxleKinesis = proxyquire('../../processors/apiaxleKinesis.js', {
      '../exporters/kinesisExporter.js': exporter,
      '../parsers/apiaxleParser.js': parser,
      '../formatters/apiHits.js': formatter,
      '../formatters/mobilityTraffic.js': formatter
    });

    var processor = new ApiaxleKinesis({
      api_hits: { streamName: 'test_api_hits_stream', region: 'oz' },
      mobility_traffic: { streamName: 'test_mobility_traffic_stream', region: 'oz' }
    });
    processor.processHit('simplehit', function () {
      expect(exporter.calledWith({ streamName: 'test_api_hits_stream', region: 'oz' })).to.be.true;
      expect(exporter.calledWith({ streamName: 'test_mobility_traffic_stream', region: 'oz' })).to.be.true;
      expect(parser.calledWith('simplehit')).to.be.true;
      expect(formatter.calledWith({ api: 'valhalla' })).to.be.true;
      expect(exporteradd.calledWith('formatted')).to.be.true;
      done();
    });
  });
});
