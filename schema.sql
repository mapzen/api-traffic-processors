CREATE TABLE IF NOT EXISTS api_hits (ts TIMESTAMP, api TEXT, key TEXT, status TEXT, origin TEXT, duplicate BOOLEAN);

CREATE TABLE IF NOT EXISTS pelias_traffic_v2 (date TIMESTAMP, api_key VARCHAR(100), path VARCHAR(250), query VARCHAR(400), status INTEGER, http_method VARCHAR(100), cache_hit BOOLEAN, total_ms INTEGER, first_byte_ms INTEGER);

CREATE TABLE IF NOT EXISTS vector_traffic_v2 (date TIMESTAMP, payload_size INTEGER, source VARCHAR(100), layer VARCHAR(100), x INTEGER, y INTEGER, z SMALLINT, format VARCHAR(100), api_key VARCHAR(100), status SMALLINT, cache_hit BOOLEAN, total_ms INTEGER, first_byte_ms INTEGER);
