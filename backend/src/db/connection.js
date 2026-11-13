import fs from 'node:fs';
import Database from 'better-sqlite3';
import { config } from '../config.js';

// One shared connection. better-sqlite3 is synchronous, so every query
// finishes before the next line runs; no callbacks or awaits needed.
export const db = new Database(config.dbFile);

db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(config.schemaFile, 'utf8'));

// Runs fn inside one SQL transaction: all of its writes happen, or none do.
export function runInTransaction(fn) {
  return db.transaction(fn)();
}
