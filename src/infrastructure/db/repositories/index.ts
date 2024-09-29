import { SessionRepositoryImpl } from './token/session.repository.impl.js'
import { AuthRepositoryImpl } from './auth/auth.repository.impl.js'
import { UserRepositoryImpl } from './user/user.repository.impl.js'
import { sessionModel } from '../entities/token.entity.js'
import { userModel } from '../entities/user.entity.js'

export class FactoryRepositories {
  static createAuthRepositoryImpl = () => {
    return new AuthRepositoryImpl(userModel)
  }

  static createUserRepositoryImpl = () => {
    return new UserRepositoryImpl(userModel)
  }

  static createTokenRepository = () => {
    return new SessionRepositoryImpl(
      sessionModel,
      process.env.SECRET_ACCESS_JWT,
      process.env.SECRET_REFRESH_JWT,
      process.env.EXPIRES_IN_ACCESS,
      process.env.EXPIRES_IN_REFRESH,
      +process.env.MAX_AGE_TOKEN,
    )
  }
}
