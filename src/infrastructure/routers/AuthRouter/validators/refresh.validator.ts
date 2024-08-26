import { cookie } from 'express-validator'
import { NextFunction, Request, Response } from 'express'

export const RefreshValidator = (req: Request, res: Response, next: NextFunction) => {
  cookie('refreshToken').exists().notEmpty().isJWT()
  next()
}
