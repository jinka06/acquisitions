import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, 'database.db'),
      driver: sqlite3.Database,
    });
    await db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}