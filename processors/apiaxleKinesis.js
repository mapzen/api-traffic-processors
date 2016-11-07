/* eslint global-require: 0 */
var KinesisExporter = require('../exporters/kinesisExporter.js');
var parser = require('../parsers/apiaxleParser.js');
var formatter = {
  api_hits: require('../formatters/apiHits.js'),
  mobility_traffic: require('../formatters/mobilityTraffic.js')
};

module.exports = function apiaxleKinesis(args) {
  var exporter = {
    api_hits: new KinesisExporter(args.api_hits),
    mobility_traffic: new KinesisExporter(args.mobility_traffic)
  };

  this.processHit = function processHit(hit, cb) {
    var payload;
    payload = parser(hit);
    var api_hits_payload = formatter.api_hits(payload);
    exporter.api_hits.add(api_hits_payload);

    if (payload.api === 'valhalla' ||
        payload.api === 'elevation' ||
        payload.api === 'matrix') {
      var mobility_traffic_payload = formatter.mobility_traffic(payload);
      exporter.mobility_traffic.add(mobility_traffic_payload);
    }
    cb(null);
  };
};
