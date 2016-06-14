/* eslint-env mocha */
var expect = require('chai').expect;

var URI = require('urijs');
var keyFromUri = require('../../utility/keyFromUri.js');

describe('keyFromUri', function () {
  it('returns key for vector-tiles', function () {
    var uri = new URI('/osm/all,pois/10/283/377.mvt?api_key=vector-tiles-aBc_-9Z');
    expect(keyFromUri(uri)).to.equal('vector-tiles-aBc_-9Z');
  });

  it('returns key for pelias', function () {
    var uri = new URI('/v1/reverse?api_key=search-1234567'
      + '&boundary.country=BR&layers=address&point.lat=-22.9864246105'
      + '&point.lon=-43.2058427486&size=1');
    expect(keyFromUri(uri)).to.equal('search-1234567');
  });

  it('works with key or apiaxle_key as well', function () {
    var uri = new URI('/v1/?key=test-abcdefg');
    expect(keyFromUri(uri)).to.equal('test-abcdefg');
    uri = new URI('/v1/?apiaxle_key=test-abcdefg');
    expect(keyFromUri(uri)).to.equal('test-abcdefg');
  });

  it('can accept an array of prefixes', function () {
    var uri = new URI('/v1/?key=b-abcdefg');
    expect(keyFromUri(uri)).to.equal('b-abcdefg');
  });
});
