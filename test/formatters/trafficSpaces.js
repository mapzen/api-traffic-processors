/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect;

var trafficSpaces = require('../../formatters/trafficSpaces.js');

describe('trafficSpaces', function () {
  it('creates 6 space delimited fields', function () {
    var payload = { ts: new Date() };
    expect(trafficSpaces(payload).split(' ').length).to.eq(6);
  });

  it('replaces nulls undefined and empty strings with \\N', function () {
    var payload = { ts: new Date(0), api: null, key: undefined, status: '' };
    expect(trafficSpaces(payload).split(' ').slice(-4, -1))
      .to.deep.equal(['\\N', '\\N', '\\N']);
  });

  it('formats ts as isostring', function () {
    var payload = { ts: new Date(0) };
    expect(trafficSpaces(payload).split(' ')[0]).to.equal('1970-01-01T00:00:00.000Z');
  });

  it('doesnt allow fields to have backslashes except for nulls as \\N', function () {
    var payload = { ts: new Date(), api: 'test\\', key: 'k',
                    status: 's', origin: 'a', cacheHit: null };
    expect(trafficSpaces(payload).match(/\\/)).to.be.null;
  });

  it('doesnt allow fields to be more than 256 characters', function () {
    var status = '';
    for (var i = 0; i < 257; i++) {
      status += 'a';
    }
    var payload = { ts: new Date(), status: status };
    trafficSpaces(payload).split(' ').forEach(function (field) {
      expect(field.length).to.be.below(257);
    });
  });

  it('handles fields that are only backslashes correctly', function () {
    var payload = { ts: new Date(0), key: '\\' };
    expect(trafficSpaces(payload)).to.equal('1970-01-01T00:00:00.000Z \\N \\N \\N \\N false');
  });
});
