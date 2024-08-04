import jwt from 'jsonwebtoken';
import { tsUnix } from '../../../utils/date.js';
import { genUuid } from '../../../utils/generate.js';
import { sessionModel } from '../../entities/token.entity.js';
import { GenerateTokensResult } from './dtos/generate-tokens-result.dto.js';
import 'dotenv/config.js';
export class SessionRepositoryImpl {
    constructor() {
        this.session = sessionModel;
        this.SECRET_ACCESS_JWT = process.env.SECRET_ACCESS_JWT;
        this.SECRET_REFRESH_JWT = process.env.SECRET_REFRESH_JWT;
        this.EXPIRES_IN_ACCESS = process.env.EXPIRES_IN_ACCESS;
        this.EXPIRES_IN_REFRESH = process.env.EXPIRES_IN_REFRESH;
        this.MAX_AGE_TOKEN = +process.env.MAX_AGE_TOKEN;
        this.generateTokens = (payload) => {
            const accessToken = jwt.sign(payload, this.SECRET_ACCESS_JWT, { expiresIn: this.EXPIRES_IN_ACCESS });
            const refreshToken = jwt.sign(payload, this.SECRET_REFRESH_JWT, { expiresIn: this.EXPIRES_IN_REFRESH });
            return new GenerateTokensResult(accessToken, refreshToken);
        };
        this.validateAccessToken = (token) => {
            try {
                return jwt.verify(token, this.SECRET_ACCESS_JWT);
            }
            catch (err) {
                return null;
            }
        };
        this.validateRefreshToken = (token) => {
            try {
                return jwt.verify(token, this.SECRET_REFRESH_JWT);
            }
            catch (err) {
                return null;
            }
        };
        this.saveToken = async (saveTokenDto) => {
            const expire = Math.round((Date.now() + this.MAX_AGE_TOKEN) / 1000);
            const sessionData = {
                uuid: genUuid(),
                ids: {
                    uuidDevice: `${saveTokenDto.uuidDevice}`,
                    uuidUser: `${saveTokenDto.uuidUser}`,
                },
                refreshToken: { token: saveTokenDto.tokens.refreshToken, expire },
                accessToken: { token: saveTokenDto.tokens.accessToken, expire },
                dates: {
                    created: tsUnix(),
                    updated: tsUnix(),
                },
            };
            await this.session.create(sessionData);
        };
        this.removeSessionByRefresh = async (refreshToken) => {
            await this.session.deleteOne({ 'refreshToken.token': refreshToken });
        };
        this.findSessionByRefresh = async (refreshToken) => {
            return await this.session.findOne({ 'refreshToken.token': refreshToken });
        };
        this.findSessionByIds = async (ids) => {
            return await this.session.findOne({ ids });
        };
    }
}
//# sourceMappingURL=session.repository.impl.js.map