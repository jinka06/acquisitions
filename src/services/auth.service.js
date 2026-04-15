import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import { query } from '../config/db.js';

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing the password: ${e}`);
    throw new Error('Error hashing');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) throw new Error('User already exists');
    const password_hash = await hashPassword(password);
    const result = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, password_hash, role]
    );
    const newUser = result.rows[0];
    logger.info(`User ${newUser.email} created successfully.`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating the user: ${e}`);
    throw e;
  }
};

export const signIn = async ({ email, password }) => {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) throw new Error('Invalid credentials');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Invalid credentials');
    logger.info(`User ${user.email} signed in successfully.`);
    return { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at };
  } catch (e) {
    logger.error(`Error signing in: ${e}`);
    throw e;
  }
};