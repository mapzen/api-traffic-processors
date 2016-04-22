var fs = require('fs');

if (process.argv.length < 4) {
  console.log('need to call with src filename and parser');
  return;
}

function exportFileToKinesis(src, parserpath) {
  var parser = require(parserpath);
  var formatter = require('../formatters/trafficSpaces.js');
  var KinesisExporter = require('../exporters/kinesisExporter.js');
  var exporter = new KinesisExporter('api_hits_processing_dev', 'us-east-1');
  var lines = fs.readFileSync(src).toString().split('\n');
  var i;
  for (i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    exporter.add(formatter(parser(lines[i])));
    // output.push(formatter(parser(lines[i])));
  }
  console.log('done');
}

exportFileToKinesis(process.argv[2], process.argv[3]);
