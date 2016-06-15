var LogExporter = require('../exporters/logExporter.js');
var parser = require('../parsers/apiaxleParser.js');
var formatter = require('../formatters/apiHits.js');

module.exports = function apiaxleLog(args) {
  var exporter = new LogExporter({ logfile: args.logfile });

  this.processHit = function processHit(hit, cb) {
    try {
      var payload = parser(hit);
      var formattedPayload = formatter(payload);
      exporter.add(formattedPayload);
    } catch (err) {
      console.error(err);
    } finally {
      cb(null);
    }
  };
};
