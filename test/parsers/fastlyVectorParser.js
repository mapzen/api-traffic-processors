/* eslint-env mocha */
/* eslint no-unused-expressions: 0, max-len: 0 */
var fs = require('fs');
var expect = require('chai').expect;

var fastlyVectorParser = require('../../parsers/fastlyVectorParser.js');

var examples = fs.readFileSync(__dirname + '/../fixtures/vectorexample.log').toString().split('\n');

describe('fastlyVectorParser', function () {
  it('works with example log file', function () {
    examples.forEach(function (line) {
      var parsed;
      if (!line) return;
      parsed = fastlyVectorParser(line);
      try {
        expect(parsed.ts).to.be.instanceof(Date);
        expect(isFinite(parsed.ts)).to.be.true;
        expect(parsed.status).to.have.length.above(0);
        expect(parsed.payloadSize).to.not.be.undefined;
        expect(parsed.method).to.not.be.undefined;
        expect(parsed.uri).to.not.be.undefined;
        expect(parsed.key).to.not.be.undefined;
        expect(parsed.totalTime).to.not.be.undefined;
        expect(parsed.firstByteTime).to.not.be.undefined;
        expect(parsed.api).to.have.length.above(0);
        expect(parsed.origin).to.not.be.undefined;
        expect(parsed.server).to.be.oneOf(['fastly', 's3', 'tileserver']);
      } catch (err) {
        console.log(line);
        console.log(parsed);
        throw (err);
      }
    });
  });

  it('sets server based on cache_hit and server headers', function () {
    var fastlyline = '<134>2016-06-29T16:00:20Z cache-jfk1032 vector-dev-logs-new[514302]: 184.72.113.161 200 3969 GET /osm/all/1/1/1.mvt?api_key=vector-tiles-abcdefg HIT 175 0.175 Fastly';
    var tileserverline = '<134>2016-06-29T16:00:20Z cache-jfk1032 vector-dev-logs-new[514302]: 184.72.113.161 200 3969 GET /osm/all/1/1/1.mvt?api_key=vector-tiles-abcdefg MISS 175 0.175 App';
    var s3line = '<134>2016-06-29T16:00:20Z cache-jfk1032 vector-dev-logs-new[514302]: 184.72.113.161 200 3969 GET /osm/all/1/1/1.mvt?api_key=vector-tiles-abcdefg MISS 175 0.175 Fastly';
    expect(fastlyVectorParser(fastlyline).server).to.eq('fastly');
    expect(fastlyVectorParser(tileserverline).server).to.eq('tileserver');
    expect(fastlyVectorParser(s3line).server).to.eq('s3');
  });
});
