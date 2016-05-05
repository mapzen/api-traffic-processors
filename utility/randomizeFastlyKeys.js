var fs = require('fs');
var src;
var dest;
var lines;
var cleanedLines;

if (process.argv.length < 4) {
  console.log('need to call with src and dest filename');
  return;
}
src = process.argv[2];
dest = process.argv[3];

function base64(length) {
  var numbers;
  var letters;
  var base64chars;

  function buildstring(strlen, charset) {
    var i;
    var arr = [];
    for (i = 0; i < strlen; i++) {
      arr.push(charset[Math.floor(Math.random() * charset.length)]);
    }
    return arr.join('');
  }

  numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  base64chars = letters.concat(letters.map(function (c) {return c.toUpperCase();}))
                       .concat(['-', '_'])
                       .concat(numbers);
  return buildstring(length, base64chars);
}

function replaceKey(line) {
  var match = line.match(
    /(?:api_key|key|apiaxle_key)=(?:[a-z]+-)*[a-z]+-([a-zA-Z0-9-_]{7})[^a-zA-Z0-9-_]/);
  if (!match) return line;
  return line.replace(new RegExp(match[1], 'g'), base64(7));
}

lines = fs.readFileSync(src).toString().split('\n');
cleanedLines = lines.map(replaceKey);
fs.writeFileSync(dest, cleanedLines.join('\n'));
