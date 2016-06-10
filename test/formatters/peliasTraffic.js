/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect;
var URI = require('urijs');

var peliasTraffic = require('../../formatters/peliasTraffic.js');

describe('peliasTraffic', function () {
  it('creates 9 space delimited fields', function () {
    var payload = { ts: new Date(), uri: new URI() };
    expect(peliasTraffic(payload).split(' ').length).to.eq(9);
  });

  it('formats ts as isostring', function () {
    var payload = { ts: new Date(0), uri: new URI() };
    expect(peliasTraffic(payload).split(' ')[0]).to.equal('1970-01-01T00:00:00.000Z');
  });
});
