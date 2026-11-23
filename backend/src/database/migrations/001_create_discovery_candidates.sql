
CREATE TABLE IF NOT EXISTS discovery_candidates (
  id TEXT PRIMARY KEY,
  procedure_json TEXT NOT NULL,
  scope TEXT NOT NULL,
  location_json TEXT NOT NULL,
  base_procedure_id TEXT,
  original_query TEXT NOT NULL,
  discovered_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL,
  duplicate_of TEXT
);

CREATE INDEX IF NOT EXISTS idx_discovery_candidates_status
ON discovery_candidates(status);

CREATE INDEX IF NOT EXISTS idx_discovery_candidates_created_at
ON discovery_candidates(created_at);
