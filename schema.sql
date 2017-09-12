CREATE TABLE IF NOT EXISTS api_hits (
  ts TIMESTAMP SORTKEY ENCODE delta,
  api VARCHAR(256) ENCODE lzo,
  key VARCHAR(256) ENCODE lzo,
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
    api_key VARCHAR(100) ENCODE lzo,
    status SMALLINT ENCODE lzo,
    total_ms INTEGER ENCODE lzo,
    server VARCHAR(100) ENCODE lzo,
    host VARCHAR(100) ENCODE lzo,
    service VARCHAR(100) ENCODE lzo,
    version VARCHAR(100) ENCODE lzo,
    path VARCHAR(100) ENCODE lzo,
    is_xonacatl BOOLEAN,
    tilesize VARCHAR(100) ENCODE lzo
);

CREATE TABLE IF NOT EXISTS api_hits_day (
  ts TIMESTAMP SORTKEY ENCODE delta,
  api VARCHAR(256) ENCODE lzo,
  key VARCHAR(256) DISTKEY ENCODE lzo,
  status VARCHAR(256) ENCODE lzo,
  hits INTEGER ENCODE lzo
);

CREATE TABLE IF NOT EXISTS api_hits_hour (
  ts TIMESTAMP SORTKEY ENCODE delta,
  api VARCHAR(256) ENCODE lzo,
  key VARCHAR(256) DISTKEY ENCODE lzo,
  status VARCHAR(256) ENCODE lzo,
  source VARCHAR(256) ENCODE lzo,
  hits INTEGER ENCODE lzo
);

CREATE TABLE IF NOT EXISTS api_hits_minute (
  ts TIMESTAMP SORTKEY ENCODE delta,
  api VARCHAR(256) ENCODE lzo,
  key VARCHAR(256) DISTKEY ENCODE lzo,
  status VARCHAR(256) ENCODE lzo,
  source VARCHAR(256) ENCODE lzo,
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
  developer_nickname VARCHAR(100) ENCODE lzo,
  email VARCHAR(256) ENCODE lzo,
  mapzen BOOLEAN,
  account_id INT4 ENCODE lzo
);

CREATE TABLE IF NOT EXISTS hourly_project_costs (
  stack VARCHAR(256) DISTKEY ENCODE lzo,
  type VARCHAR(256) ENCODE lzo,
  region VARCHAR(256) ENCODE lzo,
  date TIMESTAMP SORTKEY ENCODE delta,
  cost FLOAT4,
  quantity FLOAT4,
  prepaid FLOAT4
);

CREATE TABLE IF NOT EXISTS reservations (
  region VARCHAR(100),
  type VARCHAR(100),
  num INT2,
  prepaid FLOAT4,
  starttime TIMESTAMP,
  endtime TIMESTAMP
);

CREATE TABLE IF NOT EXISTS running_instances (
  region VARCHAR(100),
  type VARCHAR(100),
  num INT2
);

CREATE TABLE IF NOT EXISTS shutoffs_sync (
  key VARCHAR(256) DISTKEY ENCODE lzo,
  service VARCHAR(256) ENCODE lzo,
  shutoff BOOLEAN,
  updated_at TIMESTAMP ENCODE lzo
);

CREATE TABLE IF NOT EXISTS service_rates (
  id INT4 DISTKEY ENCODE lzo,
  slug VARCHAR(256) ENCODE lzo,
  account_id INT4 ENCODE lzo,
  free INT4 ENCODE lzo,
  cpm DECIMAL(15,5) ENCODE lzo,
  starts_at TIMESTAMP ENCODE lzo,
  ends_at TIMESTAMP ENCODE lzo
);

CREATE TABLE IF NOT EXISTS accounts (
  id INT4 DISTKEY ENCODE lzo,
  plan VARCHAR(256) ENCODE lzo,
  state VARCHAR(256) ENCODE lzo,
  spending_limit DECIMAL(15,5) ENCODE lzo
);

CREATE TABLE IF NOT EXISTS requests_last_sync (
  last_sync TIMESTAMP ENCODE lzo
);

CREATE TABLE IF NOT EXISTS discounts (
  id INT4 SORTKEY ENCODE zstd,
  account_id INT4 DISTKEY ENCODE zstd,
  service_id INT4 ENCODE zstd,
  name VARCHAR(256) ENCODE zstd,
  percentage DECIMAL(6,3) ENCODE zstd,
  starts_at TIMESTAMP ENCODE zstd,
  ends_at TIMESTAMP ENCODE zstd
);
