import { type NextFunction, type Request, type Response } from 'express'
import { validationResult } from 'express-validator'
import { FactoryRepositories } from '../../db/repositories'
import { ApiError } from '../../exceptions/api.exception.js'
import { ResponseTokenDto } from './dtos/response-token.dto.js'
import { AuthService } from '../../../core/services/auth.service.js'
import { BrokerRepositoryImpl } from '../../broker/broker.repository.impl'
import { type IAuthRequest } from '../../interfaces/auth.request.interface.js'
import { type SignInDto } from '../../../core/repositories/auth/dtos/sign-in.dto.js'
import { type SignUpDto } from '../../../core/repositories/auth/dtos/sign-up.dto.js'
import { type RefreshDto } from '../../../core/repositories/auth/dtos/refresh.dto.js'
import { BrokerService } from '../../../core/services/broker.service'
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
    res.cookie('refreshToken', refreshToken, { maxAge: +process.env.MAX_AGE_TOKEN, httpOnly: true, path: '/api/auth' })
  }
}

export default new AuthController(
  new AuthService(
    process.env.API_URL,
    FactoryRepositories.createAuthRepositoryImpl(),
    new BrokerService(new BrokerRepositoryImpl()),
  ),
)
