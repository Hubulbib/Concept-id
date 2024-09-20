import { SessionRepositoryImpl } from './TokenReposiory/session.repository.impl'
import { AuthRepositoryImpl } from './AuthRepository/auth.repository.impl'
import { UserRepositoryImpl } from './UserRepository/user.repository.impl'
import { sessionModel } from '../entities/token.entity'
import { userModel } from '../entities/user.entity'

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
