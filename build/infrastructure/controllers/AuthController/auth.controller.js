import { validationResult } from 'express-validator';
import { ApiError } from '../../exceptions/api.exception.js';
import { ResponseTokenDto } from './dtos/response-token.dto.js';
import { AuthService } from '../../../core/services/AuthService/auth.service.js';
import { AuthRepositoryImpl } from '../../db/repositories/AuthRepository/auth.repository.impl.js';
import 'dotenv/config';
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signIn = async (req, res, next) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
                    return;
                }
                const detail = { ua: req.get('User-Agent'), ip: req.ip };
                const authBody = req.body;
                const authData = await this.authService.signIn(authBody, detail);
                this.resCookieRefreshToken(res, authData.refreshToken);
                res.json(new ResponseTokenDto(authData));
            }
            catch (err) {
                next(err);
            }
        };
        this.signUp = async (req, res, next) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log(errors.array());
                    next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
                    return;
                }
                const detail = { ua: req.get('User-Agent'), ip: req.ip };
                const authBody = req.body;
                const authData = await this.authService.signUp(authBody, detail);
                this.resCookieRefreshToken(res, authData.refreshToken);
                res.status(201).json(new ResponseTokenDto(authData));
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        this.refresh = async (req, res, next) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
                    return;
                }
                const detail = { ua: req.get('User-Agent'), ip: req.ip };
                const authCookies = req.cookies;
                const authData = await this.authService.refresh(authCookies, detail);
                this.resCookieRefreshToken(res, authData.refreshToken);
                res.json(new ResponseTokenDto(authData));
            }
            catch (err) {
                next(err);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
                    return;
                }
                const { refreshToken } = req.cookies;
                await this.authService.logout(refreshToken);
                res.clearCookie('refreshToken');
            }
            catch (err) {
                next(err);
            }
        };
        this.resCookieRefreshToken = (res, refreshToken) => {
            res.cookie('refreshToken', refreshToken, { maxAge: +process.env.MAX_AGE_TOKEN, httpOnly: true, path: '/api/auth' });
        };
    }
}
export default new AuthController(new AuthService(new AuthRepositoryImpl()));
//# sourceMappingURL=auth.controller.js.map