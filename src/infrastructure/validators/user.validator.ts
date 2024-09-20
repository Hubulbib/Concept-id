import { NextFunction, Response } from 'express'
import { ApiError } from '../exceptions/api.exception'
import { IAuthRequest } from '../interfaces/auth.request.interface'

export class UserValidator {
  static editAvatar = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (!req.files['avatar']) {
      next(ApiError.BadRequest('Файл не найден'))
    }
    next()
  }
}
