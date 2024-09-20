import { type UserEntity } from '../../../entites/user.entity.js'

export class AuthBackDto {
  constructor(
    readonly user: UserEntity,
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly activationLink?: string,
  ) {}
}
