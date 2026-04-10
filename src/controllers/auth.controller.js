import logger from '../config/logger.js';
import { createUser } from '../services/auth.service.js';
import { signupSchema } from '../validations/auth.validation.js';
import { formatValidationError } from '../utils/format.js'

export const signup = async (req, res, next) => {
    try{
        const validationResult = signupSchema.safeParse(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error)
            });
        }

        const { name, email, role } = validationResult.data;
        const newUser = await createUser(validationResult.data)

        // AUTH SERVICE

        logger.info(`User registered successfully: ${email}`)
        res.status(201).json({
            message: "User registered",
            user: newUser
        })
    } catch(e){
        logger.error('Signup error', e);
        if(e.message === 'User already exists'){
            return res.status(409).json({ error: 'Email already exist'});
        }

        next(e);
    }
}