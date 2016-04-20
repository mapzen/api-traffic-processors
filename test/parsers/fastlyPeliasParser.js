var fs = require('fs');
var expect = require('chai').expect;

var fastlyPeliasParser = require('../../parsers/fastlyPeliasParser.js');

var examples = fs.readFileSync(__dirname + '/../fixtures/peliasexample.log').toString().split('\n');

describe('fastlyPeliasParser', function() {
  it('works with example log file', function() {
    examples.forEach(function(line) {
      if (!line) return;
      var parsed = fastlyPeliasParser(line);
      try {
        expect(parsed.ts).to.be.instanceof(Date);
        expect(isFinite(parsed.ts)).to.be.true;
        expect(parsed.api).to.have.length.above(0);
        expect(parsed.key).to.have.length.above(0);
        expect(parsed.status).to.have.length.above(0);
        expect(parsed.path).to.have.length.above(0);
        expect(parsed.query).to.have.length.above(0);
      } catch (err) {
        console.log(line);
        console.log(parsed);
        throw(err);
      }
    });
  });
});
