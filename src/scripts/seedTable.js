import { createUsersTable } from '../models/user.model.js';
import { createUser } from '../services/auth.service.js';

const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user',
  },
];

async function seedTable() {
  await createUsersTable();
  for (const user of users) {
    await createUser(user);
  }
  console.log('Users seeded successfully');
  process.exit(0);
}

seedTable().catch(e => {
  console.error('Seeding failed:', e.message);
  process.exit(1);
});
