import logger from '../config/logger.js';
import { createUser, signIn } from '../services/auth.service.js';
import { signupSchema, signInSchema } from '../validations/auth.validation.js';
import { formatValidationError } from '../utils/format.js';
import { cookies } from '../utils/cookies.js';
import { jwttoken } from '../utils/jwt.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;
    const newUser = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    cookies.set(res, 'token', token);

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (e) {
    logger.error('Signup error', e);
    if (e.message === 'User already exists') {
      return res.status(409).json({ error: 'Email already exist' });
    }

    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }
    const { email, password } = validationResult.data;
    const user = await signIn({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);
    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'Sign in successful',
      user,
    });
  } catch (e) {
    logger.error('Signin error', e);
    if (e.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    next(e);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out successfully');
    res.status(200).json({ message: 'Sign out successful' });
  } catch (e) {
    logger.error('Signout error', e);
    next(e);
  }
};
