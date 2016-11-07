var fsv = require('../utility/fsv.js');

module.exports = function vectorTraffic(fields) {
  return [
    fields.ts.toISOString(),
    fsv.escapeField(fields.api, 100),
    fsv.escapeField(fields.key, 100),
    fsv.escapeField(fields.status, 100),
    fsv.escapeField(fields.path, 250),
    fsv.escapeField(fields.query, 400)
  ].join(' ');
};
