var keyFromPath = require('../utility/keyFromPath.js');

module.exports = function parse(line) {
  var fields = line.split(' ');
  var timestamp = fields[0].substring(5);
  var fullPath = fields[12];
  var status = fields[13];

  return {
    ts: new Date(timestamp),
    api: 'vector-tiles',
    key: keyFromPath(fullPath),
    status: status
  };
};
