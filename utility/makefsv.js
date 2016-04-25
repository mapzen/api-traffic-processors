var fs = require('fs');

if (process.argv.length < 5) {
  console.log('need to call with src, dest filenames, and parser');
  return;
}

function parseFile(src, dest, parserpath) {
  var parser = require(parserpath);
  var formatter = require('../formatters/trafficSpaces.js');
  var lines = fs.readFileSync(src).toString().split('\n');
  var i;
  var output = [];
  for (i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    output.push(formatter(parser(lines[i])));
  }
  fs.writeFileSync(dest, output.join('\n'));
  console.log('done');
}

parseFile(process.argv[2], process.argv[3], process.argv[4]);
