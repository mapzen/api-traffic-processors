function clean(field) {
  if (field === '' || field === undefined || field === null) return '\\N';
  return String(field).replace(/ /g, '%20'); // probably not needed, but just to be safe
}

module.exports = function trafficSpaces(fields) {
  return [
    fields.ts.toISOString(),
    fields.api,
    fields.key,
    fields.status,
    fields.path,
    fields.query
  ].map(clean).join(' ');
};
