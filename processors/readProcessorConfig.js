module.exports = function (filename) {
  var config = require('../config/' + filename);

  return {
    parser: require('../parsers/' + config.parser),
    formatter: require('../formatters/' + config.formatter),
    exporter: new (require('../exporters/' + config.exporter.filename))(config.exporter.args)
  };
};
