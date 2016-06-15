var fsv = require('../utility/fsv.js');

module.exports = function peliasTraffic(fields) {
  var query = fields.uri.query(true);
  delete query.api_key;
  return [
    fields.ts.toISOString(),
    fsv.escapeField(fields.key, 100),
    fsv.escapeField(fields.uri.path(), 250),
    fsv.escapeField(JSON.stringify(query), 400),
    fsv.cleanInt(fields.status, 4),
    fsv.escapeField(fields.method, 100),
    fields.cacheHit === 'HIT',
    fsv.cleanInt(fields.totalTime, 4),
    fsv.cleanInt(fields.firstByteTime, 4)
  ].join(' ');
};
