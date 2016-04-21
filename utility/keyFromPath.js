var URI = require('urijs');

module.exports = function (path) {
  var query = new URI(path).query(true);
  return query.api_key || query.key || query.apiaxle_key || null;
};
