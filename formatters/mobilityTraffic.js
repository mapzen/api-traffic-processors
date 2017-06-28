var fsv = require('../utility/fsv.js');

module.exports = function mobilityTraffic(fields) {
  return [
    fields.ts.toISOString(),
    fsv.escapeField(fields.api, 100),
    fsv.escapeField(fields.key, 100),
    fsv.escapeField(fields.status, 100),
    fsv.escapeField(fields.pathname, 250),
    fsv.escapeField(fields.search, 400)
  ].join(' ');
};
