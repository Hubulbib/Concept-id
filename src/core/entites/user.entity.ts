export class UserEntity {
  constructor(
    readonly uuid: string,
    readonly username: string,
    readonly email: string,
    readonly role: string,
    readonly avatar?: string,
  ) {}
}
