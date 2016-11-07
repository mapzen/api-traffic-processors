module.exports = function parse(hit) {
  var api = hit.api_name;
  if (api === 'pelias-search') api = 'search';
  return {
    ts: new Date(),
    api: api,
    key: hit.key_name,
    status: hit.error
            ? hit.error.name
            : hit.status_code,
    origin: 'apiaxle',
    cacheHit: null,
    pathname: hit.parsed_url && hit.parsed_url.pathname,
    search: hit.parsed_url && decodeURIComponent(hit.parsed_url.search)
  };
};
