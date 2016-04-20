module.exports = function(path, prefix) {
  if (prefix.constructor === Array) {
    prefix = '(?:' + prefix.join('|') + ')';
  }
  var regex = new RegExp("(?:apiaxle_key|api_key|key)=(" + prefix + "-[0-9a-zA-Z_-]{7})");
  var match = path.match(regex);
  return match ? match[1] : null;
}
