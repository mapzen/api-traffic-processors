/* eslint-env mocha */
/* eslint no-unused-expressions: 0, max-len: 0 */
var expect = require('chai').expect;

var fastlyVectorParser = require('../../parsers/fastlyVectorParser.js');

describe('fastlyVectorParser', function () {
  it('parses pre-1.0 syntax without version', function () {
    var line =
      '<134>2016-09-20T19:21:00Z cache-jfk8145 vector-dev-logs-new[95219]: 200 8130 16 S3 vector.mapzen.com /osm/all/1/2/3.json?api_key=nicekey (null)';

    var expected = {
      ts: new Date('2016-09-20T19:21:00Z'),
      key: 'nicekey',
      status: '200',
      origin: 'fastly',
      cacheHit: 'HIT',
      size: '8130',
      total_ms: '16',
      server: 'S3',
      path: '/osm/all/1/2/3.json?api_key=nicekey',
      api: 'vector-tiles',
      layer: 'all',
      x: '2',
      y: '3',
      z: '1',
      hostname: 'vector.mapzen.com',
      format: 'json',
      version: null,
      is_xonacatl: false,
      duplicate: false,
      tilesize: undefined
    };

    var parsed = fastlyVectorParser(line);
    expect(parsed).to.deep.equal(expected);
  });

  it('parses pre-1.0 syntax with version', function () {
    var line =
      '<134>2016-09-20T19:21:01Z cache-jfk8128 vector-dev-logs-new[95219]: 200 114020 15 S3 vector.mapzen.com /osm/version/layer/z/x/y.fmt?api_key=nicekey 1';

    var expected = {
      ts: new Date('2016-09-20T19:21:01Z'),
      key: 'nicekey',
      status: '200',
      origin: 'fastly',
      cacheHit: 'HIT',
      size: '114020',
      total_ms: '15',
      server: 'S3',
      path: '/osm/version/layer/z/x/y.fmt?api_key=nicekey',
      api: 'vector-tiles',
      layer: 'layer',
      x: 'x',
      y: 'y',
      z: 'z',
      hostname: 'vector.mapzen.com',
      format: 'fmt',
      version: 'version',
      is_xonacatl: true,
      duplicate: true,
      tilesize: undefined
    };

    var parsed = fastlyVectorParser(line);
    expect(parsed).to.deep.equal(expected);
  });

  it('parses 1.0 syntax vector-tiles', function () {
    var line =
      '<134>2016-09-20T19:21:01Z cache-jfk8128 vector-dev-logs-new[95219]: 200 114020 15 S3 tile.mapzen.com /mapzen/vector/version/layer/z/x/y.fmt?api_key=nicekey (null)';

    var expected = {
      ts: new Date('2016-09-20T19:21:01Z'),
      key: 'nicekey',
      status: '200',
      origin: 'fastly',
      cacheHit: 'HIT',
      size: '114020',
      total_ms: '15',
      server: 'S3',
      path: '/mapzen/vector/version/layer/z/x/y.fmt?api_key=nicekey',
      api: 'vector-tiles',
      layer: 'layer',
      x: 'x',
      y: 'y',
      z: 'z',
      hostname: 'tile.mapzen.com',
      format: 'fmt',
      version: 'version',
      is_xonacatl: false,
      duplicate: false,
      tilesize: null
    };

    var parsed = fastlyVectorParser(line);
    expect(parsed).to.deep.equal(expected);
  });

  it('parses 1.0 syntax vector-tiles with tilesize specifier', function () {
    var line =
      '<134>2017-03-27T14:38:22Z cache-iad2129 vector-dev-logs-new[94020]: 200 821513 0 Fastly tile.dev.mapzen.com /mapzen/vector/v1/512/all/1/1/1.json?api_key=mapzen-testing (null)';

    var expected = {
      ts: new Date('2017-03-27T14:38:22Z'),
      key: 'mapzen-testing',
      status: '200',
      origin: 'fastly',
      cacheHit: 'HIT',
      size: '821513',
      total_ms: '0',
      server: 'Fastly',
      path: '/mapzen/vector/v1/512/all/1/1/1.json?api_key=mapzen-testing',
      api: 'vector-tiles',
      layer: 'all',
      x: '1',
      y: '1',
      z: '1',
      hostname: 'tile.dev.mapzen.com',
      format: 'json',
      version: 'v1',
      is_xonacatl: false,
      duplicate: false,
      tilesize: '512'
    };

    var parsed = fastlyVectorParser(line);
    expect(parsed).to.deep.equal(expected);
  });

  it('parses 1.0 syntax terrain-tiles non-skadi layer', function () {
    var line =
      '<134>2016-09-20T19:21:01Z cache-jfk8128 vector-dev-logs-new[95219]: 200 114020 15 S3 tile.mapzen.com /mapzen/terrain/version/layer/z/x/y.fmt?api_key=nicekey (null)';

    var expected = {
      ts: new Date('2016-09-20T19:21:01Z'),
      key: 'nicekey',
      status: '200',
      origin: 'fastly',
      cacheHit: 'HIT',
      size: '114020',
      total_ms: '15',
      server: 'S3',
      path: '/mapzen/terrain/version/layer/z/x/y.fmt?api_key=nicekey',
      api: 'terrain-tiles',
      layer: 'layer',
      x: 'x',
      y: 'y',
      z: 'z',
      hostname: 'tile.mapzen.com',
      format: 'fmt',
      version: 'version',
      is_xonacatl: false,
      duplicate: false,
      tilesize: undefined
    };

    var parsed = fastlyVectorParser(line);
    expect(parsed).to.deep.equal(expected);
  });

  it('parses 1.0 syntax terrain-tiles skadi layer', function () {
    var line =
      '<134>2016-09-20T19:21:01Z cache-jfk8128 vector-dev-logs-new[95219]: 200 114020 15 S3 tile.mapzen.com /mapzen/terrain/v1/skadi/N25/N25W136.hgt.gz?api_key=nicekey (null)';

    var expected = {
      ts: new Date('2016-09-20T19:21:01Z'),
      key: 'nicekey',
      status: '200',
      origin: 'fastly',
      cacheHit: 'HIT',
      size: '114020',
      total_ms: '15',
      server: 'S3',
      path: '/mapzen/terrain/v1/skadi/N25/N25W136.hgt.gz?api_key=nicekey',
      api: 'terrain-tiles',
      layer: 'skadi',
      x: -136,
      y: '25',
      z: null,
      hostname: 'tile.mapzen.com',
      format: 'hgt.gz',
      version: 'v1',
      is_xonacatl: false,
      duplicate: false,
      tilesize: undefined
    };

    var parsed = fastlyVectorParser(line);
    expect(parsed).to.deep.equal(expected);
  });

  it("doesn't throw error when skadi latlng is bad", function () {
    var line =
      '<134>2016-09-20T19:21:01Z cache-jfk8128 vector-dev-logs-new[95219]: 200 114020 15 S3 tile.mapzen.com /mapzen/terrain/v1/skadi/N25/N25Z136.hgt.gz?api_key=nicekey';
    expect(function () { fastlyVectorParser(line); }).to.not.throw(Error);
  });

  it('fills x, y, z as undefined for tilejson requests', function () {
    var line =
      '<134>2016-09-20T19:21:01Z cache-jfk8128 vector-dev-logs-new[95219]: 200 114020 15 S3 vector.mapzen.com /osm/tilejson/mapbox.json?api_key=nicekey';

    var parsed = fastlyVectorParser(line);
    expect(parsed.x).to.eq(undefined);
    expect(parsed.y).to.eq(undefined);
    expect(parsed.z).to.eq(undefined);

    line =
      '<134>2016-09-20T19:21:01Z cache-jfk8128 vector-dev-logs-new[95219]: 200 114020 15 S3 tile.mapzen.com /mapzen/vector/v1/tilejson/mapbox.json?api_key=nicekey';

    parsed = fastlyVectorParser(line);
    expect(parsed.x).to.eq(undefined);
    expect(parsed.y).to.eq(undefined);
    expect(parsed.z).to.eq(undefined);
  });
});
