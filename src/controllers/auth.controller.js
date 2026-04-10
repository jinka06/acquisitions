import logger from '../config/logger.js';
import { createUser } from '../services/auth.service.js';
import { signupSchema } from '../validations/auth.validation.js';
import { formatValidationError } from '../utils/format.js'
import { cookies } from '../utils/cookies.js'
import { jwttoken } from '../utils/jwt.js'

export const signup = async (req, res, next) => {
    try{
        const validationResult = signupSchema.safeParse(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error)
            });
        }

        const { name, email, password, role } = validationResult.data;
        const newUser = await createUser({ name, email, password, role})
        const token = jwttoken.sign({id: newUser.id, email: newUser.email, role: newUser.role});
        cookies.set(res, 'token', token);

        logger.info(`User registered successfully: ${email}`)
        res.status(201).json({
            message: "User registered",
            user: {
                id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role
            }
        })
    } catch(e){
        logger.error('Signup error', e);
        if(e.message === 'User already exists'){
            return res.status(409).json({ error: 'Email already exist'});
        }

        next(e);
    }
}