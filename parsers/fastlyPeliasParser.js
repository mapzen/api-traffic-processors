var keyFromPath = require('../utility/keyFromPath.js');

module.exports = function parse(line) {
  var fields = line.split(' ');
  var timestamp = fields[0].substring(5);
  var fullPath = fields[13];
  var status = fields[14];

  return {
    ts: new Date(timestamp),
    api: 'search',
    key: keyFromPath(fullPath),
    status: status
  };
};
