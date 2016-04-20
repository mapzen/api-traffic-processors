var KinesisExporter = require('../exporters/kinesisExporter.js');
var parser = require('../parsers/apiaxleParser.js');
var formatter = require('../formatters/trafficSpaces.js');

module.exports = function() {
  var exporter = new KinesisExporter();

  this.processHit = function(hit, cb) {
    var payload = parser(hit);
    var formatted_payload = formatter(payload);
    exporter.add(formatted_payload);
    cb(null);
  };
};
