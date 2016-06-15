var KinesisExporter = require('../exporters/kinesisExporter.js');
var parser = require('../parsers/apiaxleParser.js');
var formatter = require('../formatters/apiHits.js');

module.exports = function apiaxleKinesis(args) {
  var exporter = new KinesisExporter({
    streamName: args.streamName,
    region: args.region
  });

  this.processHit = function processHit(hit, cb) {
    var payload;
    var formattedPayload;
    payload = parser(hit);
    formattedPayload = formatter(payload);
    exporter.add(formattedPayload, cb);
  };
};
