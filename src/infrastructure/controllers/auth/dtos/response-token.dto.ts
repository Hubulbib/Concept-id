import { type AuthBackDto } from '../../../../core/repositories/auth/dtos/auth-back.dto.js'
import { type UserEntity } from '../../../../core/entites/user.entity.js'

export class ResponseTokenDto {
  public user: UserEntity
  public accessToken: string

  constructor(data: AuthBackDto) {
    this.user = data.user
    this.accessToken = data.accessToken
  }
}
