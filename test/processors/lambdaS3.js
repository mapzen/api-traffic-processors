/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var s3Success = {
  S3: function () {
    this.getObject = function (ignored, callback) {
      callback(null, { Body: 'results\n' });
    };
    this.copyObject = function (ignored, callback) { callback(null); };
    this.deleteObject = function (ignored, callback) { callback(null); };
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
    parsers: { test: parser },
    formatter: formatter,
    exporter: exporter,
    exporteradd: exporteradd,
    exporteraddbatch: exporteraddbatch
  };
}

describe('lambdaS3', function () {
  it('runs without errors', function (done) {
    var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Success });
    var processor = new LambdaS3(stubConfig());

    processor(s3Event, null, function (err) {
      expect(err).to.not.exist;
      done();
    });
  });

  it('sends s3 errors to the callback', function (done) {
    var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Failure });
    var processor = new LambdaS3(stubConfig());

    processor(s3Event, null, function (err) {
      expect(err).to.be.an.error;
      done();
    });
  });

  it('returns error when no parser for service', function (done) {
    var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Success });
    var processor = new LambdaS3(stubConfig());

    processor(s3BadEvent, null, function (err) {
      expect(err).to.be.an.error;
      done();
    });
  });
});
