import logger from '../config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../services/users.service.js';
import { formatValidationError } from '../utils/format.js';
import {
  userIdSchema,
  updateUserSchema,
} from '../validations/user.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');
    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    logger.info(`Getting user by id: ${req.params.id}`);

    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }
    const user = await getUserById(validationResult.data.id);
    logger.info(`User ${user.email} retrieved successfully`);
    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (e) {
    logger.error(`Error fetching user by id: ${e.message}`, { cause: e });
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const paramValid = userIdSchema.safeParse(req.params);
    const bodyValid = updateUserSchema.safeParse(req.body);

    if (!paramValid.success || !bodyValid.success) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const updatedUser = await updateUser(paramValid.data.id, bodyValid.data);
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (e) {
    logger.error(`Error updating user by id: ${e.message}`, { cause: e });
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success)
      return res.status(400).json({ error: 'Invalid ID' });

    await deleteUser(validation.data.id);
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (e) {
    logger.error(`Error deleting user by id: ${e.message}`, { cause: e });
    next(e);
  }
};
