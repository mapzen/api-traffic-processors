module.exports = function (filename) {
  var config = require('../config/' + filename);
  if (config.pause) return config;

  var result = {};
  Object.keys(config).forEach(function (prefix) {
    result[prefix] = {
      parser: require('../parsers/' + config[prefix].parser),
      outputs: config[prefix].outputs.map(function (output) {
        return {
          formatter: require('../formatters/' + output.formatter),
          exporter: new (require('../exporters/' + output.exporter.filename))(output.exporter.args)
        };
      })
    };
  });
  return result;
};
