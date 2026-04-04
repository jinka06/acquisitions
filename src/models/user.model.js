import { getDb } from '../config/db.js'

async function createUsersTable() {
    const db = await getDb()
    await db.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datatime('now')),
      updated_at TEXT NOT NULL DEFAULT (datatime('now'))
    )`)
    console.log('Table created successfully');
    await db.close();
}

createUsersTable()