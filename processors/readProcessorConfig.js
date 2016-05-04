module.exports = function (filename) {
  var config = require('../config/' + filename);

  var parsers = {};
  Object.keys(config.parsers).forEach(function (parser) {
    parsers[parser] = require('../parsers/' + config.parsers[parser]);
  });

  return {
    parsers: parsers,
    formatter: require('../formatters/' + config.formatter),
    exporter: new (require('../exporters/' + config.exporter.filename))(config.exporter.args)
  };
};
