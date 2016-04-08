var log4js = require('log4js');
log4js.configure({
  appenders: [
    {
      type: 'file',
      layout: {
        type: 'messagePassThrough',
      },
      filename: process.env.TRAFFIC_LOGFILE
    }
  ]
});
var logger = log4js.getLogger();

module.exports = function() {
  this.processHit = function(hit, cb) {
    try {
      logger.info(formatHit(hit));
      cb(null);
    } catch (err) {
      console.log(err);
      cb(err);
    }
  };
}

// hit properties:
//   error
//   status_code || error
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
    status: hit.error
            ? hit.error.name
            : hit.status_code,
    query: hit.parsed_url ? hit.parsed_url.search : null,
    pathname: hit.parsed_url ? hit.parsed_url.pathname : null,
  };
  return Object.keys(payload).map(function(key) {return encode(payload[key]);}).join(',');
}

// encode commas
function encode(field) {
  field = String(field).replace(/,/g, "%4C");
  // field = field.replace(/'/g, "%27");
  return field;
}
