import { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'

export const SignInValidator = (req: Request, res: Response, next: NextFunction) => {
  body('email').isEmail()
  body('password').exists().notEmpty()
  next()
}
