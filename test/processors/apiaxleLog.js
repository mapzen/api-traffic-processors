/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('apiaxleLog', function () {
  beforeEach(function () {
    sinon.stub(console, 'error');
  });

  afterEach(function () {
    console.error.restore();
  });

  it('calls everything', function (done) {
    var exporteradd = sinon.spy();
    var exporter = sinon.stub().returns({ add: exporteradd });
    var parser = sinon.stub().returns('parsed');
    var formatter = sinon.stub().returns('formatted');
    var ApiaxleLog = proxyquire('../../processors/apiaxleLog.js', {
      '../exporters/logExporter.js': exporter,
      '../parsers/apiaxleParser.js': parser,
      '../formatters/apiHits.js': formatter
    });

    var processor = new ApiaxleLog({ logfile: 'testlog' });
    processor.processHit('simplehit', function () {
      expect(exporter.calledOnce).to.be.true;
      expect(parser.calledWith('simplehit')).to.be.true;
      expect(formatter.calledWith('parsed')).to.be.true;
      expect(exporteradd.calledWith('formatted')).to.be.true;
      done();
    });
  });

  it('catches errors', function (done) {
    var exporteradd = sinon.spy();
    var exporter = sinon.stub().returns({ add: exporteradd });
    var parser = sinon.stub().throws('intentional error');
    var formatter = sinon.stub().returns('formatted');
    var ApiaxleLog = proxyquire('../../processors/apiaxleLog.js', {
      '../exporters/logExporter.js': exporter,
      '../parsers/apiaxleParser.js': parser,
      '../formatters/apiHits.js': formatter
    });

    var processor = new ApiaxleLog({ logfile: 'testlog' });
    expect(processor.processHit('simplehit', done)).to.not.throw.errors;
    expect(console.error.called).to.be.true;
  });
});
