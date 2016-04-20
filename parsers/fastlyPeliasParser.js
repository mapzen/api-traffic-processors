var keyFromPath = require('../utility/keyFromPath.js');

module.exports = function parse(line) {
  var api_prefixes = ['search', 'pelias', 'pelias-search'];
  var fields = line.split(' ');
  var queryindex = fields[13].indexOf('?');
  return {
    ts: new Date(fields[0].substring(5)),
    api: 'search',
    key: keyFromPath(fields[13], api_prefixes),
    status: fields[14],
    query: queryindex !== -1 ? fields[13].substring(queryindex) : null,
    path: queryindex !== -1 ? fields[13].substring(0,queryindex) : fields[13],
  };
};
