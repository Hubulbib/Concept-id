import { body } from 'express-validator'

export const SignInValidator = [body('email').isEmail(), body('password').exists().notEmpty()]
