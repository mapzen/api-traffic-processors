var keyFromPath = require('../utility/keyFromPath.js');

module.exports = function parse(line) {
  var fields = line.split(' ');
  var timestamp = fields[0].substring(5);
  var status = fields[4];
  var fullPath = fields[7];
  var cacheHit = fields[8];
  var responseTime = fields[9];

  return {
    ts: new Date(timestamp),
    api: 'search',
    key: keyFromPath(fullPath),
    status: status,
    origin: 'fastly',
    cacheHit: cacheHit,
    responseTime: responseTime
  };
};
