/* eslint global-require: 0 */
var fs = require('fs');

if (process.argv.length < 6) {
  console.log('need to call with src, dest filenames, parser, and formatter');
  return;
}

function parseFile(src, dest, parserpath, formatterpath) {
  var parser = require('../parsers/' + parserpath);
  var formatter = require('../formatters/' + formatterpath);
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

parseFile(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
