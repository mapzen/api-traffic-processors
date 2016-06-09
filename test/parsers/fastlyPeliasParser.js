/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
var fs = require('fs');
var expect = require('chai').expect;

var fastlyPeliasParser = require('../../parsers/fastlyPeliasParser.js');

var examples = fs.readFileSync(__dirname + '/../fixtures/peliasexample.log').toString().split('\n');

describe('fastlyPeliasParser', function () {
  it('works with example log file', function () {
    examples.forEach(function (line) {
      var parsed;
      if (!line) return;
      parsed = fastlyPeliasParser(line);
      try {
        expect(parsed.ts).to.be.instanceof(Date);
        expect(isFinite(parsed.ts)).to.be.true;
        expect(parsed.api).to.have.length.above(0);
        expect(parsed.key).to.have.length.above(0);
        expect(parsed.status).to.have.length.above(0);
        expect(parsed.origin).to.not.be.undefined;
        expect(parsed.cacheHit).to.not.be.undefined;
      } catch (err) {
        console.log(line);
        console.log(parsed);
        throw (err);
      }
    });
  });
});
