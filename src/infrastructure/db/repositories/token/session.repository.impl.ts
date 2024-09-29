import jwt, { type JwtPayload } from 'jsonwebtoken'
import { tsUnix } from '../../../utils/date.js'
import { genUuid } from '../../../utils/generate.js'
import { type Session, type SessionIds } from '../../entities/token.entity.js'
import { type SessionRepository } from './interfaces/session.interface.js'
import { type SaveTokenDto } from './dtos/save-token.dto.js'
import { GenerateTokensResult } from './dtos/generate-tokens-result.dto.js'
import 'dotenv/config.js'
import { BeAnObject } from '@typegoose/typegoose/lib/types'
import { ReturnModelType } from '@typegoose/typegoose'

export class SessionRepositoryImpl implements SessionRepository {
  constructor(
    private readonly sessionRepository: ReturnModelType<typeof Session, BeAnObject>,
    private readonly SECRET_ACCESS_JWT: string,
    private readonly SECRET_REFRESH_JWT: string,
    private readonly EXPIRES_IN_ACCESS: string,
    private readonly EXPIRES_IN_REFRESH: string,
    private readonly MAX_AGE_TOKEN: number,
  ) {}

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

    await this.sessionRepository.create(sessionData)
  }

  public removeSessionByRefresh = async (refreshToken: string): Promise<void> => {
    await this.sessionRepository.deleteOne({ 'refreshToken.token': refreshToken })
  }

  public findSessionByRefresh = async (refreshToken: string): Promise<Session> => {
    return this.sessionRepository.findOne({ 'refreshToken.token': refreshToken })
  }

  public findSessionByIds = async (ids: SessionIds): Promise<Session> => {
    return this.sessionRepository.findOne({ ids })
  }
}
