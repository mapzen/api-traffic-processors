/* eslint-env mocha */
var expect = require('chai').expect;

var keyFromPath = require('../../utility/keyFromPath.js');

describe('keyFromPath', function () {
  it('returns key for vector-tiles', function () {
    var path = '/osm/all,pois/10/283/377.mvt?api_key=vector-tiles-aBc_-9Z';
    expect(keyFromPath(path)).to.equal('vector-tiles-aBc_-9Z');
  });

  it('returns key for pelias', function () {
    var path =
      '/v1/reverse?api_key=search-1234567'
      + '&boundary.country=BR&layers=address&point.lat=-22.9864246105'
      + '&point.lon=-43.2058427486&size=1';
    expect(keyFromPath(path)).to.equal('search-1234567');
  });

  it('works with key or apiaxle_key as well', function () {
    var path = '/v1/?key=test-abcdefg';
    expect(keyFromPath(path)).to.equal('test-abcdefg');
    path = '/v1/?apiaxle_key=test-abcdefg';
    expect(keyFromPath(path)).to.equal('test-abcdefg');
  });

  it('can accept an array of prefixes', function () {
    var path = '/v1/?key=b-abcdefg';
    expect(keyFromPath(path)).to.equal('b-abcdefg');
  });
});
