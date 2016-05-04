/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

function stubLogger() {
  var info = sinon.stub();
  var getLogger = sinon.stub().returns({ info: info });
  return {
    log4js: { getLogger: getLogger },
    getLogger: getLogger,
    info: info
  };
}

describe('logExporter', function () {
  describe('add', function () {
    it('produces correct output', function () {
      var stubs = stubLogger();
      var LogExporter = proxyquire('../../exporters/logExporter.js', {
        log4js: stubs.log4js
      });
      var exporter = new LogExporter('testlog');

      exporter.add('payload');
      expect(stubs.info.firstCall.args).to.deep.equal(['payload']);
    });
  });
});
