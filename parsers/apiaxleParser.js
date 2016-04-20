module.exports = function parse(hit) {
  return {
    ts: new Date(),
    api: hit.api_name,
    key: hit.key_name,
    status: hit.error
            ? hit.error.name
            : hit.status_code,
    query: hit.parsed_url ? hit.parsed_url.search : null,
    path: hit.parsed_url ? hit.parsed_url.pathname : null,
  };
};
