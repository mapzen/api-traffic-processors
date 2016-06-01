var fs = require('fs');

if (process.argv.length < 6) {
  console.log('need to call with src, parser, streamname, awsregion');
  return;
}

function exportFileToKinesis(src, parserpath, streamname, region) {
  var parser = require(parserpath);
  var formatter = require('../formatters/trafficSpaces.js');
  var KinesisExporter = require('../exporters/kinesisExporter.js');
  var exporter = new KinesisExporter({ streamName: streamname, region: region });
  var lines = fs.readFileSync(src).toString().split('\n');
  var i;
  var batch = [];
  for (i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    batch.push(formatter(parser(lines[i])));
  }
  exporter.addBatch(batch, function (exporterr, exportresult) {
    console.log(exporterr, exportresult);
  });
}

exportFileToKinesis(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
