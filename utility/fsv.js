function cleanInt(int, bytes) {
  var x = parseInt(int, 10);
  if (isNaN(x)) return '\\N';
  if (x > Math.pow(2, 8 * bytes - 1) - 1 ||
      x < -Math.pow(2, 8 * bytes - 1)) {
    return '\\N';
  }
  return x;
}

function escapeField(field, length) {
  if (field === '' || field === undefined || field === null) return '\\N';
  var escaped = field.substring(0, length)
                     .replace(/\\/g, '\\\\') // escape backslashes
                     .replace(/ /g, '\\ ') // escape spaces
                     .substring(0, length); // make sure escaping didn't put us over

  // make sure the last substring didn't leave a trailing backslash
  var endingBackslashes = escaped.match(/\\*$/)[0];
  if (endingBackslashes.length % 2 === 1) {
    // we have a trailing backslash so leave if off of the result
    escaped = escaped.substring(0, escaped.length - 1);
  }
  if (escaped === '' || escaped === undefined || escaped === null) return '\\N';
  return escaped;
}

module.exports = {
  cleanInt: cleanInt,
  escapeField: escapeField
};
