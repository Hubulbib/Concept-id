import { type NextFunction, type Request, type Response } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../../exceptions/api.exception.js'
import { ResponseTokenDto } from './dtos/response-token.dto.js'
import { type IAuthRequest } from '../../interfaces/auth.request.interface.js'
import { AuthService } from '../../../core/services/AuthService/auth.service.js'
import { AuthRepositoryImpl } from '../../db/repositories/AuthRepository/auth.repository.impl.js'
import { type SignInDto } from '../../../core/repositories/AuthRepository/dtos/sign-in.dto'
import { type SignUpDto } from '../../../core/repositories/AuthRepository/dtos/sign-up.dto'
import { type RefreshDto } from '../../../core/repositories/AuthRepository/dtos/refresh.dto'
import 'dotenv/config.js'

class AuthController {
  constructor(readonly authService: AuthService) {}

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
        return
      }
      const detail = { ua: req.get('User-Agent'), ip: req.ip }
      const authBody: SignInDto = req.body
      const authData = await this.authService.signIn(authBody, detail)
      this.resCookieRefreshToken(res, authData.refreshToken)
      res.json(new ResponseTokenDto(authData))
    } catch (err) {
      next(err)
    }
  }

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log(errors.array())
        next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
        return
      }
      const detail = { ua: req.get('User-Agent'), ip: req.ip }
      const authBody: SignUpDto = req.body
      const authData = await this.authService.signUp(authBody, detail)
      this.resCookieRefreshToken(res, authData.refreshToken)
      res.status(201).json(new ResponseTokenDto(authData))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  refresh = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
        return
      }
      const detail = { ua: req.get('User-Agent'), ip: req.ip }
      const authCookies: RefreshDto = req.cookies
      const authData = await this.authService.refresh(authCookies, detail)
      this.resCookieRefreshToken(res, authData.refreshToken)
      res.json(new ResponseTokenDto(authData))
    } catch (err) {
      next(err)
    }
  }

  logout = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
        return
      }
      const { refreshToken }: RefreshDto = req.cookies
      await this.authService.logout(refreshToken)
      res.clearCookie('refreshToken').end()
    } catch (err) {
      next(err)
    }
  }

  activate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { link } = req.params
      await this.authService.activate(link)
      res.redirect(process.env.CLIENT_URL)
    } catch (err) {
      next(err)
    }
  }

  private readonly resCookieRefreshToken = (res: Response, refreshToken: string): void => {
    res
      .cookie('refreshToken', refreshToken, { maxAge: +process.env.MAX_AGE_TOKEN, httpOnly: true, path: '/api/auth' })
      .end()
  }
}

export default new AuthController(new AuthService(new AuthRepositoryImpl()))
