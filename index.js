var fs = require('fs');

module.exports = function() {
  var logfilename = process.env.traffic_logfile;

  this.processHit = function(hit, cb) {
    fs.appendFile(logfilename, formatHit(hit) + '\n', cb);
  };
}

// hit properties:
//   error
//   status_code
//   api_name
//   key_name
//   keyring_names
//   timing
//   is_keyless
//   parsed_url
function formatHit(hit) {
  var payload = {
    timestamp: new Date().getTime(),
    api: hit.api_name,
    key: hit.key_name,
    status: hit.status_code,
    query: hit.parsed_url ? hit.parsed_url.search : null,
    pathname: hit.parsed_url ? hit.parsed_url.pathname : null,
  };
  return Object.keys(payload).map(function(key) {return encode(payload[key]);}).join(',');
}

// encode commas
function encode(field) {
  field = field.replace(/,/g, "%4C");
  // field = field.replace(/'/g, "%27");
  return field;
}
