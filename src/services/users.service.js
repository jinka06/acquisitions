import logger from '../config/logger.js';
import { query } from '../config/db.js';

export const getAllUsers = async () => {
  try {
    const result = await query(
      'SELECT id, name, role, created_at, updated_at FROM users'
    );
    return result.rows;
  } catch (e) {
    logger.error('Error getting users', { cause: e });
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const result = await query(
      'SELECT id, name, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (e) {
    logger.error(`Error getting the user: ${e.message}`, { cause: e });
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const existingUser = await getUserById(id);

    // Check email uniqueness if it's being updated
    if (updates.email && updates.email !== existingUser.email) {
      const emailCheck = await query('SELECT id FROM users WHERE email = $1', [
        updates.email,
      ]);
      if (emailCheck.rows.length > 0) {
        throw new Error('Email already exists');
      }
    }

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           role = COALESCE($3, role), 
           updated_at = NOW() 
       WHERE id = $4 
       RETURNING id, name, email, role, updated_at`,
      [updates.name, updates.email, updates.role, id]
    );
    return result.rows[0];
  } catch (e) {
    logger.error(`Failed to update user: ${e.message}`, { cause: e });
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    await getUserById(id);

    await query('DELETE FROM users WHERE id = $1', [id]);
    return { success: true };
  } catch (e) {
    logger.error('Failed to delete the user', { cause: e });
    throw e;
  }
};
