var fs = require('fs');
var yaml = require('js-yaml');

module.exports = function() {
  var config = yaml.safeLoad(fs.readFileSync(__dirname + 'config.yml'));
  var logfilename = config.logfile;

  this.processHit = function(hit, cb) {
    fs.appendFile(logfilename, formatHit(hit), cb);
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
  return Object.keys(payload).map(function(key) {return encodeURIComponent(payload[key]);}).join(',');
}
