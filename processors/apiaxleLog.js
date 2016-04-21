var LogExporter = require('../exporters/logExporter.js');
var parser = require('../parsers/apiaxleParser.js');
var formatter = require('../formatters/trafficSpaces.js');

module.exports = function apiaxleLog() {
  var exporter = new LogExporter(process.env.TRAFFIC_LOGFILE);

  this.processHit = function processHit(hit, cb) {
    var payload;
    var formattedPayload;
    try {
      payload = parser(hit);
      formattedPayload = formatter(payload);
      exporter.add(formattedPayload);
    } catch (err) {
      console.log(err);
    } finally {
      cb(null);
    }
  };
};
