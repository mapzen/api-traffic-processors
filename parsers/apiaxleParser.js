module.exports = function parse(hit) {
  var api = hit.api_name;
  if (api === 'pelias-search') api = 'search';
  var searchstring = null;
  try {
    searchstring = hit.parsed_url && decodeURIComponent(hit.parsed_url.search);
    if (searchstring.length > 0 && searchstring[0] === '?') {
      searchstring = searchstring.slice(1);
    }
  } catch (err) {
    // let searchstring be null because we can't decode parsed_url.search
  }
  return {
    ts: new Date(),
    api: api,
    key: hit.key_name,
    status: hit.error
            ? hit.error.name
            : hit.status_code,
    origin: 'apiaxle',
    pathname: hit.parsed_url && hit.parsed_url.pathname,
    search: searchstring,
    duplicate: false
  };
};
