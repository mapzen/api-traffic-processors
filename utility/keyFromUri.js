module.exports = function (uri) {
  var query = uri.query(true);
  return query.api_key || query.key || query.apiaxle_key || null;
};
