/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect;
var URI = require('urijs');

var vectorTraffic = require('../../formatters/vectorTraffic.js');

describe('vectorTraffic', function () {
  it('creates 13 space delimited fields', function () {
    var payload = { ts: new Date(), uri: new URI() };
    expect(vectorTraffic(payload).split(' ').length).to.eq(13);
  });

  it('formats ts as isostring', function () {
    var payload = { ts: new Date(0), uri: new URI() };
    expect(vectorTraffic(payload).split(' ')[0]).to.equal('1970-01-01T00:00:00.000Z');
  });

  it('works with 8 component paths', function () {
    var payload = { ts: new Date(0), uri: new URI('/999/abcdef/s/l/134/156/12.form') };
    expect(vectorTraffic(payload))
      .to.eq('1970-01-01T00:00:00.000Z \\N s l 156 12 134 form \\N \\N false \\N \\N');
  });

  it('works with 6 component paths', function () {
    var payload = { ts: new Date(0), uri: new URI('/s/l/134/156/12.form') };
    expect(vectorTraffic(payload))
      .to.eq('1970-01-01T00:00:00.000Z \\N s l 156 12 134 form \\N \\N false \\N \\N');
  });

  it('skips with unknown number of component paths', function () {
    var payload = { ts: new Date(0), uri: new URI('/s/l/134/1/56/12.form') };
    expect(vectorTraffic(payload))
      .to.eq('1970-01-01T00:00:00.000Z \\N \\N \\N \\N \\N \\N \\N \\N \\N false \\N \\N');
  });

  it('skips it there is more than one . in the path', function () {
    var payload = { ts: new Date(0), uri: new URI('/s/l/134/56/1.2.form') };
    expect(vectorTraffic(payload))
      .to.eq('1970-01-01T00:00:00.000Z \\N \\N \\N \\N \\N \\N \\N \\N \\N false \\N \\N');
  });
});
