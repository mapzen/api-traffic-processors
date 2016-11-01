var fsv = require('../utility/fsv.js');

module.exports = function vectorTraffic(fields) {
  return [
    fields.ts.toISOString(),
    fsv.cleanInt(fields.size, 4),
    fsv.escapeField(fields.layer, 100),
    fsv.cleanInt(fields.x, 4),
    fsv.cleanInt(fields.y, 4),
    fsv.cleanInt(fields.z, 2),
    fsv.escapeField(fields.format, 100),
    fsv.escapeField(fields.key, 100),
    fsv.cleanInt(fields.status, 2),
    fsv.cleanInt(fields.total_ms, 4),
    fsv.escapeField(fields.server, 100),
    fsv.escapeField(fields.hostname, 100),
    fsv.escapeField(fields.api, 100),
    fsv.escapeField(fields.version, 100),
    fsv.escapeField(fields.path, 100),
    !!fields.is_xonacatl
  ].join(' ');
};
