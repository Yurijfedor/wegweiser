import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const databaseDirectory = path.resolve(process.cwd(), "data");

fs.mkdirSync(databaseDirectory, { recursive: true });

const databasePath = path.join(databaseDirectory, "wegweiser.sqlite");

export const database = new Database(databasePath);

database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");

const migrationPath = path.resolve(
  process.cwd(),
  "src/database/migrations/001_create_discovery_candidates.sql",
);

const migration = fs.readFileSync(migrationPath, "utf8");

database.exec(migration);
