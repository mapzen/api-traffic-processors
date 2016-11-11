var fsv = require('../utility/fsv.js');

module.exports = function apiHits(fields) {
  return [
    fields.ts.toISOString(),
    fsv.escapeField(fields.api, 256),
    fsv.escapeField(fields.key, 256),
    fsv.escapeField(fields.status, 256),
    fsv.escapeField(fields.origin, 256),
    fields.cacheHit === 'MISS'
  ].join(' ');
};
