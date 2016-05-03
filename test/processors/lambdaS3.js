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
  }
};

var s3Failure = {
  S3: function () {
    this.getObject = function (ignored, callback) {
      callback(new Error('intentional error'));
    };
  }
};

var s3event = {
  Records: [
    {
      s3: {
        bucket: {
          name: 'srcbucket'
        },
        object: {
          key: 'srcfile'
        }
      }
    }
  ]
};

function stubConfig() {
  var exporteradd = sinon.spy();
  var exporter = { add: exporteradd };
  var parser = sinon.stub().returns('parsed');
  var formatter = sinon.stub().returns('formatted');
  return {
    parser: parser,
    formatter: formatter,
    exporter: exporter,
    exporteradd: exporteradd
  };
}

describe('lambdaS3', function () {
  it('runs without errors', function (done) {
    var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Success });
    var processor = new LambdaS3(stubConfig());

    processor(s3event, null, function (err) {
      expect(err).to.be.falsy;
      done();
    });
  });

  it('sends s3 errors to the callback', function (done) {
    var LambdaS3 = proxyquire('../../processors/lambdaS3.js', { 'aws-sdk': s3Failure });
    var processor = new LambdaS3(stubConfig());

    processor(s3event, null, function (err) {
      expect(err).to.be.an.error;
      done();
    });
  });
});
