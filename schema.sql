CREATE TABLE IF NOT EXISTS api_hits (
  ts TIMESTAMP SORTKEY ENCODE delta,
  api VARCHAR(256) ENCODE lzo,
  key VARCHAR(256) DISTKEY ENCODE lzo,
  status VARCHAR(256) ENCODE lzo,
  origin VARCHAR(256) ENCODE lzo,
  duplicate BOOLEAN
);

CREATE TABLE IF NOT EXISTS pelias_traffic_v2 (date TIMESTAMP SORTKEY ENCODE delta,
  api_key VARCHAR(100) DISTKEY ENCODE lzo,
  path VARCHAR(250) ENCODE lzo,
  query VARCHAR(400) ENCODE lzo,
  status INTEGER ENCODE lzo,
  http_method VARCHAR(100) ENCODE lzo,
  cache_hit BOOLEAN,
  total_ms INTEGER ENCODE lzo,
  first_byte_ms INTEGER ENCODE lzo
);

CREATE TABLE IF NOT EXISTS tile_traffic_v4 (
    date TIMESTAMP SORTKEY ENCODE delta,
    size INTEGER ENCODE lzo,
    layer VARCHAR(100) ENCODE lzo,
    x INTEGER ENCODE lzo,
    y INTEGER ENCODE lzo,
    z SMALLINT ENCODE lzo,
    format VARCHAR(100) ENCODE lzo,
    api_key VARCHAR(100) DISTKEY ENCODE lzo,
    status SMALLINT ENCODE lzo,
    total_ms INTEGER ENCODE lzo,
    server VARCHAR(100) ENCODE lzo,
    host VARCHAR(100) ENCODE lzo,
    service VARCHAR(100) ENCODE lzo,
    version VARCHAR(100) ENCODE lzo,
    path VARCHAR(100) ENCODE lzo,
    is_xonacatl BOOLEAN
);

CREATE TABLE IF NOT EXISTS api_hits_day (
  ts TIMESTAMP SORTKEY ENCODE delta,
  api VARCHAR(256) ENCODE lzo,
  key VARCHAR(256) DISTKEY ENCODE lzo,
  status VARCHAR(256) ENCODE lzo,
  hits INTEGER ENCODE lzo
);

CREATE TABLE IF NOT EXISTS mobility_traffic (
  ts TIMESTAMP SORTKEY ENCODE delta,
  api VARCHAR(100) ENCODE lzo,
  key VARCHAR(100) DISTKEY ENCODE lzo,
  status VARCHAR(100) ENCODE lzo,
  path VARCHAR(250) ENCODE lzo,
  query VARCHAR(400) ENCODE lzo
);

CREATE TABLE IF NOT EXISTS keys (
  key VARCHAR(100) SORTKEY ENCODE lzo,
  developer_id INT4 DISTKEY ENCODE lzo,
  developer_nickname VARCHAR(100) ENCODE lzo
);
