var URI = require('urijs');
var keyFromUri = require('../utility/keyFromUri.js');

function parsePath(hostname, path) {
  // http://vector.mapzen.com/osm/tilejson/mapbox.json
  // http://tile.mapzen.com/mapzen/vector/v1/tilejson/mapbox.json
  if (path.match(/\/tilejson\//)) return {};

  var pathParts;
  var version;
  var last;

  if (hostname.substring(0, 6) === 'vector') {
    // path = /osm/layer/z/x/y.fmt or /osm/version/layer/z/x/y.fmt
    pathParts = path.split('/');
    if (pathParts.length === 7) {
      version = pathParts[2];
      pathParts = pathParts.slice(3);
    } else if (pathParts.length === 6) {
      version = null;
      pathParts = pathParts.slice(2);
    } else {
      return {};
    }
    // pathParts = [layer,z,x,y.fmt]
    last = pathParts[3].match(/^([^.]*)\.(.*)/);
    return {
      api: 'vector-tiles',
      layer: pathParts[0],
      z: pathParts[1],
      x: pathParts[2],
      y: last[1],
      format: last[2],
      version: version
    };
  } else if (hostname.substring(0, 4) === 'tile') {
    // /mapzen/vector/v1/all/1/1/1.mvt
    // /mapzen/terrain/v1/normal/0/0/0.png
    // /mapzen/terrain/v1/skadi/N25/N25W136.hgt.gz
    pathParts = path.split('/');
    var api = pathParts[2];
    version = pathParts[3];
    var layer = pathParts[4];
    if (api === 'vector') {
      last = pathParts[7].match(/^([^.]*)\.(.*)/);
      return {
        api: 'vector-tiles',
        layer: layer,
        z: pathParts[5],
        x: pathParts[6],
        y: last[1],
        format: last[2],
        version: version
      };
    } else if (api === 'terrain') {
      if (layer !== 'skadi') {
        // /mapzen/terrain/v1/normal/0/0/0.png
        last = pathParts[7].match(/^([^.]*)\.(.*)/);
        return {
          api: 'terrain-tiles',
          layer: layer,
          z: pathParts[5],
          x: pathParts[6],
          y: last[1],
          format: last[2],
          version: version
        };
      } else { // layer === 'skadi'
        // /mapzen/terrain/v1/skadi/N25/N25W136.hgt.gz
        last = pathParts[6].match(/^([^.]*)\.(.*)/);
        var filename = last[1];

        var latlngMatch = filename.match(/^([NS])(\d{2})([EW])(\d{3})$/);
        if (latlngMatch.length !== 5) return {};
        var lat = latlngMatch[2];
        if (latlngMatch[1] === 'S') lat *= -1;
        var lng = latlngMatch[4];
        if (latlngMatch[3] === 'W') lng *= -1;
        return {
          api: 'terrain-tiles',
          layer: layer,
          z: null,
          x: lng,
          y: lat,
          format: last[2],
          version: version
        };
      }
    } else {
      return {};
    }
  } else {
    return {};
  }
}

module.exports = function parse(line) {
  // well formed inputs:

  // http://vector.mapzen.com/osm/all/1/1/1.json
  // http://vector.mapzen.com/osm/v0.9/all/1/1/1.json
  // http://vector.mapzen.com/osm/tilejson/mapbox.json

  // http://tile.mapzen.com/mapzen/vector/v1/tilejson/mapbox.json
  // http://tile.mapzen.com/mapzen/vector/v1/all/1/1/1.mvt
  // http://tile.mapzen.com/mapzen/terrain/v1/normal/0/0/0.png
  // http://tile.mapzen.com/mapzen/terrain/v1/skadi/N25/N25W136.hgt.gz

  var fields = line.split(' ');
  var timestamp = fields[0].substring(5);
  var status = fields[3];
  var size = fields[4];
  var totalMs = fields[5];
  var server = fields[6];
  var hostname = fields[7];
  var path = fields[8];
  var isXonacatl = fields[9] && fields[9] !== '(null)';

  var uri = new URI(path || '');
  var key = keyFromUri(uri);

  var parsedPath;
  try {
    parsedPath = parsePath(hostname, uri.path());
  } catch (err) {
    parsedPath = {};
  }
  if (!parsedPath.api) {
    // always default to vector-tiles service so something gets set if
    // url parsing fails
    parsedPath.api = 'vector-tiles';
  }

  return {
    ts: new Date(timestamp),
    api: parsedPath.api,
    key: key,
    status: status,
    origin: 'fastly',
    cacheHit: (server === 'App' || server === 'Layers') ? 'MISS' : 'HIT',
    size: size,
    total_ms: totalMs,
    server: server,
    path: path,
    layer: parsedPath.layer,
    x: parsedPath.x,
    y: parsedPath.y,
    z: parsedPath.z,
    hostname: hostname,
    format: parsedPath.format,
    version: parsedPath.version,
    is_xonacatl: isXonacatl,
    duplicate: server === 'App' || isXonacatl
  };
};
