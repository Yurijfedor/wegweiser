import type Database from "better-sqlite3";

import type {
  DiscoveryCandidate,
  DiscoveryCandidateStatus,
} from "./discoveryCandidate";

import type { DiscoveryRepository } from "./discoveryRepository";

interface DiscoveryCandidateRow {
  id: string;
  procedure_json: string;
  scope: string;
  location_json: string;
  base_procedure_id: string | null;
  original_query: string;
  discovered_by: string;
  created_at: string;
  status: string;
  duplicate_of: string | null;
}

export const createSQLiteDiscoveryRepository = (
  database: Database.Database,
): DiscoveryRepository => {
  const insertStatement = database.prepare(`
    INSERT INTO discovery_candidates (
      id,
      procedure_json,
      scope,
      location_json,
      base_procedure_id,
      original_query,
      discovered_by,
      created_at,
      status,
      duplicate_of
    )
    VALUES (
      @id,
      @procedure_json,
      @scope,
      @location_json,
      @base_procedure_id,
      @original_query,
      @discovered_by,
      @created_at,
      @status,
      @duplicate_of
    )
  `);

  const getByIdStatement = database.prepare(`
    SELECT * FROM discovery_candidates
    WHERE id = ?
  `);

  const getAllStatement = database.prepare(`
    SELECT * FROM discovery_candidates
    ORDER BY rowid ASC
  `);

  const updateStatusStatement = database.prepare(`
    UPDATE discovery_candidates
    SET status = ?
    WHERE id = ?
  `);

  const mapRowToCandidate = (
    row: DiscoveryCandidateRow,
  ): DiscoveryCandidate => ({
    id: row.id,
    procedure: JSON.parse(row.procedure_json),
    scope: row.scope as DiscoveryCandidate["scope"],
    location: JSON.parse(row.location_json),
    ...(row.base_procedure_id && {
      baseProcedureId: row.base_procedure_id,
    }),
    originalQuery: row.original_query,
    discoveredBy: row.discovered_by as "ai",
    createdAt: row.created_at,
    status: row.status as DiscoveryCandidateStatus,
    ...(row.duplicate_of && {
      duplicateOf: row.duplicate_of,
    }),
  });

  return {
    async add(candidate) {
      insertStatement.run({
        id: candidate.id,
        procedure_json: JSON.stringify(candidate.procedure),
        scope: candidate.scope,
        location_json: JSON.stringify(candidate.location),
        base_procedure_id: candidate.baseProcedureId ?? null,
        original_query: candidate.originalQuery,
        discovered_by: candidate.discoveredBy,
        created_at: candidate.createdAt,
        status: candidate.status,
        duplicate_of: candidate.duplicateOf ?? null,
      });
    },

    async getById(id) {
      const row = getByIdStatement.get(id) as DiscoveryCandidateRow | undefined;

      return row ? mapRowToCandidate(row) : null;
    },

    async getAll() {
      const rows = getAllStatement.all() as DiscoveryCandidateRow[];

      return rows.map(mapRowToCandidate);
    },

    async updateStatus(id, status) {
      const result = updateStatusStatement.run(status, id);

      if (result.changes === 0) {
        return null;
      }

      const row = getByIdStatement.get(id) as DiscoveryCandidateRow | undefined;

      return row ? mapRowToCandidate(row) : null;
    },
  };
};
