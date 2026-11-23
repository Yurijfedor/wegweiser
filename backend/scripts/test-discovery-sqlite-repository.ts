import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import Database from "better-sqlite3";

import { createSQLiteDiscoveryRepository } from "../src/services/discovery/sqliteDiscoveryRepository";
import type { DiscoveryCandidate } from "../src/services/discovery/discoveryCandidate";

const runTests = async () => {
  console.log("Testing SQLite Discovery Repository...\n");

  const tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "wegweiser-discovery-"),
  );

  const databasePath = path.join(tempDirectory, "test.sqlite");

  const migrationPath = path.resolve(
    process.cwd(),
    "src/database/migrations/001_create_discovery_candidates.sql",
  );

  const migration = fs.readFileSync(migrationPath, "utf8");

  const candidate: DiscoveryCandidate = {
    id: "candidate-001",
    procedure: {
      categoryId: "wohnen",
      title: "Container auf öffentlicher Straße aufstellen",
      description: "Eine Sondernutzungserlaubnis beantragen.",
      region: "Mayen, Rheinland-Pfalz",
      sources: [
        {
          title: "Stadt Mayen",
          url: "https://www.mayen.de/",
          authority: "www.mayen.de",
        },
      ],
      steps: [
        {
          id: "step-1",
          title: "Antrag vorbereiten",
          description: "Erforderliche Unterlagen zusammenstellen.",
          documents: [
            {
              id: "doc-1",
              title: "Skizze",
              description: "Skizze mit den Maßen des Containers.",
              required: false,
            },
          ],
        },
      ],
      verification: {
        status: "unverified",
      },
    },
    scope: "local",
    location: {
      countryCode: "DE",
      region: "Rheinland-Pfalz",
      city: "Mayen",
    },
    originalQuery: "Container auf öffentlicher Straße aufstellen",
    discoveredBy: "ai",
    createdAt: "2026-11-23T12:00:00.000Z",
    status: "pending_review",
  };

  let database: Database.Database | null = null;

  try {
    // Initialize database
    database = new Database(databasePath);
    database.exec(migration);

    let repository = createSQLiteDiscoveryRepository(database);

    // Test 1: Add candidate
    await repository.add(candidate);

    console.log("✓ Candidate added");

    // Test 2: Get candidate by ID
    const found = await repository.getById(candidate.id);

    assert.deepEqual(found, candidate);

    console.log("✓ Candidate retrieved by ID");

    // Test 3: Get all candidates
    const all = await repository.getAll();

    assert.equal(all.length, 1);
    assert.deepEqual(all[0], candidate);

    console.log("✓ All candidates retrieved");

    // Test 4: Update status
    const updated = await repository.updateStatus(candidate.id, "approved");

    assert.ok(updated);
    assert.equal(updated.status, "approved");

    console.log("✓ Candidate status updated");

    // Test 5: Unknown candidate
    const missing = await repository.getById("unknown-id");

    assert.equal(missing, null);

    console.log("✓ Unknown candidate returns null");

    // Test 6: Persistence after database restart
    database.close();
    database = null;

    database = new Database(databasePath);
    repository = createSQLiteDiscoveryRepository(database);

    const restored = await repository.getById(candidate.id);

    assert.ok(restored);
    assert.equal(restored.status, "approved");
    assert.deepEqual(restored.procedure, candidate.procedure);

    console.log("✓ Candidate persists after database restart");

    // Test 7: Duplicate ID
    await assert.rejects(() => repository.add(candidate));

    console.log("✓ Duplicate candidate ID rejected");

    console.log("\nAll SQLite Discovery Repository tests passed!");
  } finally {
    database?.close();

    fs.rmSync(tempDirectory, {
      recursive: true,
      force: true,
    });
  }
};

runTests().catch((error: unknown) => {
  console.error("SQLite Repository tests failed:", error);
  process.exitCode = 1;
});
