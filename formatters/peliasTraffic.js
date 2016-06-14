var fsv = require('../utility/fsv.js');

module.exports = function peliasTraffic(fields) {
  return [
    fields.ts.toISOString(),
    fsv.escapeField(fields.key, 100),
    fsv.escapeField(fields.uri.path(), 250),
    fsv.escapeField(JSON.stringify(fields.uri.query(true)), 400),
    fsv.cleanInt(fields.status, 4),
    fsv.escapeField(fields.method, 100),
    fields.cacheHit === 'HIT',
    fsv.cleanInt(fields.totalTime, 4),
    fsv.cleanInt(fields.firstByteTime, 4)
  ].join(' ');
};
