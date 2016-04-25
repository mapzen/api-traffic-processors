module.exports = function parse(hit) {
  return {
    ts: new Date(),
    api: hit.api_name,
    key: hit.key_name,
    status: hit.error
            ? hit.error.name
            : hit.status_code
  };
};
