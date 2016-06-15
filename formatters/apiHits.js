function clean(field) {
  if (field === '' || field === undefined || field === null) return '\\N';
  var cleaned = String(field).replace(/\\/g, '').replace(/ /g, '%20').substring(0, 256);
  if (cleaned === '') return '\\N';
  return cleaned;
}

module.exports = function apiHits(fields) {
  var duplicate;
  if (fields.api === 'vector-tiles') {
    duplicate = false;
  } else {
    duplicate = fields.cacheHit === 'MISS';
  }

  return [
    fields.ts.toISOString(),
    fields.api,
    fields.key,
    fields.status,
    fields.origin,
    duplicate
  ].map(clean).join(' ');
};
