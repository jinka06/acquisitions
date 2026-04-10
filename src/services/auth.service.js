import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import { getDb } from '../config/db.js';

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error(`Error hashing the password: ${e}`);
        throw new Error('Error hashing');
    }
}

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        const db = await getDb();
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) throw new Error('User already exists');
        const password_hash = await hashPassword(password);
        const result = await db.run(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, password_hash, role]
        );
        const newUser = await db.get(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [result.lastID]
        );
        logger.info(`User ${newUser.email} created successfully.`);
        return newUser;
    } catch (e) {
        logger.error(`Error creating the user: ${e}`);
        throw e;
    }
}