import jwt, { type JwtPayload } from 'jsonwebtoken'
import { tsUnix } from '../../../utils/date.js'
import { genUuid } from '../../../utils/generate.js'
import { type Session, type SessionIds, sessionModel } from '../../entities/token.entity.js'
import { type SessionRepository } from './interfaces/session.interface.js'
import { type SaveTokenDto } from './dtos/save-token.dto.js'
import { GenerateTokensResult } from './dtos/generate-tokens-result.dto.js'
import 'dotenv/config.js'

export class SessionRepositoryImpl implements SessionRepository {
  private readonly session = sessionModel

  private readonly SECRET_ACCESS_JWT = process.env.SECRET_ACCESS_JWT
  private readonly SECRET_REFRESH_JWT = process.env.SECRET_REFRESH_JWT
  private readonly EXPIRES_IN_ACCESS = process.env.EXPIRES_IN_ACCESS
  private readonly EXPIRES_IN_REFRESH = process.env.EXPIRES_IN_REFRESH
  private readonly MAX_AGE_TOKEN = +process.env.MAX_AGE_TOKEN

  public generateTokens = (payload: object): GenerateTokensResult => {
    const accessToken = jwt.sign(payload, this.SECRET_ACCESS_JWT, { expiresIn: this.EXPIRES_IN_ACCESS })
    const refreshToken = jwt.sign(payload, this.SECRET_REFRESH_JWT, { expiresIn: this.EXPIRES_IN_REFRESH })
    return new GenerateTokensResult(accessToken, refreshToken)
  }

  public validateAccessToken = (token: string): string | JwtPayload => {
    try {
      return jwt.verify(token, this.SECRET_ACCESS_JWT)
    } catch (err) {
      return null
    }
  }

  public validateRefreshToken = (token: string): string | JwtPayload => {
    try {
      return jwt.verify(token, this.SECRET_REFRESH_JWT)
    } catch (err) {
      return null
    }
  }

  public saveToken = async (saveTokenDto: SaveTokenDto): Promise<void> => {
    // TODO: separate expire for refresh and access
    const expire = Math.round((Date.now() + this.MAX_AGE_TOKEN) / 1000)
    const sessionData: Session = {
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
    }

    await this.session.create(sessionData)
  }

  public removeSessionByRefresh = async (refreshToken: string): Promise<void> => {
    await this.session.deleteOne({ 'refreshToken.token': refreshToken })
  }

  public findSessionByRefresh = async (refreshToken: string): Promise<Session> => {
    return await this.session.findOne({ 'refreshToken.token': refreshToken })
  }

  public findSessionByIds = async (ids: SessionIds): Promise<Session> => {
    return await this.session.findOne({ ids })
  }
}
