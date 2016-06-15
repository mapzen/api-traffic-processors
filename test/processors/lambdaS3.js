/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var s3Success = {
  S3: function () {
    this.getObject = sinon.stub().callsArgWith(1, null, { Body: 'results\n' });
    this.copyObject = sinon.stub().callsArgWith(1, null);
    this.deleteObject = sinon.stub().callsArgWith(1, null);
  }
};

var s3BadCopy = {
  S3: function () {
    this.getObject = sinon.stub().callsArgWith(1, null, { Body: 'results\n' });
    this.copyObject = sinon.stub().callsArgWith(1, new Error('intentional error'));
    this.deleteObject = sinon.stub().callsArgWith(1, null);
  }
};

var s3BadDelete = {
  S3: function () {
    this.getObject = sinon.stub().callsArgWith(1, null, { Body: 'results\n' });
    this.copyObject = sinon.stub().callsArgWith(1, null);
    this.deleteObject = sinon.stub().callsArgWith(1, new Error('intentional error'));
  }
};

var s3Failure = {
  S3: function () {
    this.getObject = function (ignored, callback) {
      callback(new Error('intentional error'));
    };
  }
};

var s3Event = {
  Records: [{
    s3: {
      bucket: {
        name: 'srcbucket'
      },
      object: {
        key: 'dev/test/srcfile'
      }
    }
  }]
};

var s3BadEvent = {
  Records: [{
    s3: {
      bucket: {
        name: 'srcbucket'
      },
      object: {
        key: 'dev/badservice/srcfile'
      }
    }
  }]
};

function stubConfig() {
  var exporteradd = sinon.stub().callsArgWith(1, null);
  var exporteraddbatch = sinon.stub().callsArgWith(1, null);
  var exporter = { add: exporteradd, addBatch: exporteraddbatch };
  var parser = sinon.stub().returns('parsed');
  var formatter = sinon.stub().returns('formatted');
  return {
    test: {
      parser: parser,
      outputs: [
        {
          formatter: formatter,
          exporter: exporter
        }
      ]
    },

    // also directly expose stubs for easy overriding in tests
    parser: parser,
    formatter: formatter,
    exporter: exporter,
    exporteradd: exporteradd,
    exporteraddbatch: exporteraddbatch
  };
}

describe('lambdaS3', function () {
  describe('handler', function () {
    beforeEach(function () {
      sinon.stub(console, 'error');
    });

    afterEach(function () {
      console.error.restore();
    });

    it('runs without errors', function () {
      var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Success });
      var processor = new LambdaS3(stubConfig());
      processor(s3Event, null, function (err) {
        expect(err).to.be.null;
      });
      expect(console.error.called).to.be.false;
    });

    it('sends s3 get errors to the callback', function (done) {
      var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Failure });
      var processor = new LambdaS3(stubConfig());

      processor(s3Event, null, function (err) {
        expect(err).to.be.an.error;
        done();
      });
    });

    it('logs error when no parser for service', function () {
      var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Success });
      var processor = new LambdaS3(stubConfig());

      processor(s3BadEvent);
      expect(console.error.called).to.be.true;
    });

    it('returns error when addBatch fails', function (done) {
      var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Success });
      var config = stubConfig();
      config.exporteraddbatch.callsArgWith(1, new Error('err'));
      var processor = new LambdaS3(config);

      processor(s3Event, null, function (err) {
        expect(err).to.be.an.error;
        done();
      });
    });
  });

  describe('pauseHandler', function () {
    beforeEach(function () {
      sinon.stub(console, 'error');
    });

    afterEach(function () {
      console.error.restore();
    });

    it('runs without errors', function () {
      var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Success });
      var processor = new LambdaS3({ pause: true, pauseBucket: 'b', pausePrefix: 'p' });

      processor(s3Event, null, function (err) {
        expect(err).to.not.exist;
      });
      expect(console.error.called).to.be.false;
    });

    it('calls callback on copy error', function (done) {
      var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3BadCopy });
      var processor = new LambdaS3({ pause: true, pauseBucket: 'b', pausePrefix: 'p' });

      processor(s3Event, null, function (err) {
        expect(err).to.exist;
        done();
      });
    });

    it('logs on delete error', function () {
      var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3BadDelete });
      var processor = new LambdaS3({ pause: true, pauseBucket: 'b', pausePrefix: 'p' });

      processor(s3Event, null, function (err) {
        expect(err).to.not.exist;
      });
      expect(console.error.called).to.be.true;
    });
  });
});
