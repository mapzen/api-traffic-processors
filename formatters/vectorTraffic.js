var fsv = require('../utility/fsv.js');

function parseVectorPathParts(path) {
  if (!path) return null;
  var formatSplit = path.split('.');
  if (formatSplit.length !== 2) return null;
  var parts = { format: formatSplit[1] };
  var partSplit = formatSplit[0].split('/');
  if (partSplit.length === 6) {
    parts.source = fsv.escapeField(partSplit[1], 100);
    parts.layer = fsv.escapeField(partSplit[2], 100);
    parts.z = fsv.cleanInt(partSplit[3], 2);
    parts.x = fsv.cleanInt(partSplit[4], 4);
    parts.y = fsv.cleanInt(partSplit[5], 4);
  } else if (partSplit.length === 8) {
    parts.source = fsv.escapeField(partSplit[3], 100);
    parts.layer = fsv.escapeField(partSplit[4], 100);
    parts.z = fsv.cleanInt(partSplit[5], 2);
    parts.x = fsv.cleanInt(partSplit[6], 4);
    parts.y = fsv.cleanInt(partSplit[7], 4);
  } else {
    return null;
  }
  return parts;
}

module.exports = function vectorTraffic(fields) {
  var pathParts = parseVectorPathParts(fields.uri.path()) || {
    format: null, source: null, layer: null, z: null, x: null, y: null
  };

  return [
    fields.ts.toISOString(),
    fsv.cleanInt(fields.payloadSize, 4),
    fsv.escapeField(pathParts.source, 100),
    fsv.escapeField(pathParts.layer, 100),
    fsv.cleanInt(pathParts.x, 4),
    fsv.cleanInt(pathParts.y, 4),
    fsv.cleanInt(pathParts.z, 2),
    fsv.escapeField(pathParts.format, 100),
    fsv.escapeField(fields.key, 100),
    fsv.cleanInt(fields.status, 2),
    fields.cacheHit === 'HIT',
    fsv.cleanInt(fields.totalTime, 4),
    fsv.cleanInt(fields.firstByteTime, 4)
  ].join(' ');
};
