/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect;

var mobilityTraffic = require('../../formatters/mobilityTraffic.js');

describe('mobilityTraffic', function () {
  it('creates 6 space delimited fields', function () {
    var payload = { ts: new Date() };
    expect(mobilityTraffic(payload).split(' ').length).to.eq(6);
  });

  it('formats ts as isostring', function () {
    var payload = { ts: new Date(0) };
    expect(mobilityTraffic(payload).split(' ')[0]).to.equal('1970-01-01T00:00:00.000Z');
  });
});
