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
