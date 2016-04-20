var fs = require('fs');
var LogExporter = require('../exporters/logExporter.js');
var parser = require('../parsers/fastlyPeliasParser.js');
var formatter = require('../formatters/trafficSpaces.js');

var peliaslog = fs.readFileSync('../peliasexample.log').toString();

var exporter = new LogExporter('log.log');

module.exports = function() {
  peliaslog.split('\n').forEach(function(line) {
    exporter.add(parser(line));
  });
};
// module.exports = function() {
//   var exporter = new LogExporter("peliaslog");
//
//   this.processHit = function(hit) {
//       var payload = parser(hit);
//       var formatted_payload = formatter(payload);
//       exporter.add(formatted_payload);
//   };
// };
