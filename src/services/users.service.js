import logger from '../config/logger.js';
import { db } from '../config/db.js';
import { users } from '../models/user.model.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.role,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users', { cause: e });
    throw e;
  }
};
