import { type JwtPayload } from 'jsonwebtoken'
import { type SaveTokenDto } from '../dtos/save-token.dto.js'
import { type Session, type SessionIds } from '../../../entities/token.entity.js'
import { type GenerateTokensResult } from '../dtos/generate-tokens-result.dto.js'

export interface SessionRepository {
  generateTokens: (payload: object) => GenerateTokensResult
  validateAccessToken: (accessToken: string) => string | JwtPayload
  saveToken: (saveTokenDto: SaveTokenDto) => Promise<void>
  removeSessionByRefresh: (refreshToken: string) => Promise<void>
  findSessionByRefresh: (refreshToken: string) => Promise<Session>
  findSessionByIds: (ids: SessionIds) => Promise<Session>
}
