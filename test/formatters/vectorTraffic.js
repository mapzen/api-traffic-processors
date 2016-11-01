/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect;

var vectorTraffic = require('../../formatters/vectorTraffic.js');

describe('vectorTraffic', function () {
  it('creates 16 space delimited fields', function () {
    var payload = { ts: new Date() };
    expect(vectorTraffic(payload).split(' ').length).to.eq(16);
  });

  it('formats ts as isostring', function () {
    var payload = { ts: new Date(0) };
    expect(vectorTraffic(payload).split(' ')[0]).to.equal('1970-01-01T00:00:00.000Z');
  });
});
