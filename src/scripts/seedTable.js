import { getDb } from '../config/db.js';
import { createUsersTable } from '../models/user.model.js';

const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'hashed_password_1',
    role: 'admin',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'hashed_password_2',
    role: 'user',
  },
];

async function seedTable() {
  await createUsersTable();
  const db = await getDb();
  try {
    await db.exec('BEGIN TRANSACTION');
    for (const { name, email, password, role } of users) {
      await db.run(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)`,
        [name, email, password, role]
      );
    }
    await db.exec('COMMIT');
    console.log('Users seeded successfully');
  } catch (error) {
    await db.exec('ROLLBACK');
    console.error('Error seeding users:', error.message);
  }
}

seedTable();