/* eslint-env mocha */
var expect = require('chai').expect;

var trafficSpaces = require('../../formatters/trafficSpaces.js');

describe('trafficSpaces', function () {
  it('creates 6 space delimited fields', function () {
    var payload = { ts: new Date() };
    expect(trafficSpaces(payload).split(' ').length).to.eq(6);
  });

  it('replaces nulls undefined and empty strings with \\N', function () {
    var payload = { ts: new Date(0), api: null, key: undefined, status: '' };
    expect(trafficSpaces(payload).split(' ').slice(-5))
      .to.deep.equal(['\\N', '\\N', '\\N', '\\N', '\\N']);
  });

  it('formats ts as isostring', function () {
    var payload = { ts: new Date(0) };
    expect(trafficSpaces(payload).split(' ')[0]).to.equal('1970-01-01T00:00:00.000Z');
  });
});
