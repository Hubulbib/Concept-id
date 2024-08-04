export class UserEntity {
  constructor(
    readonly uuid: string,
    readonly username: string,
    readonly email: string,
    readonly role: string,
    readonly name?: string,
    readonly surname?: string,
    readonly gender?: string,
    readonly phone?: string,
    readonly dateBirthday?: Date,
    readonly avatar?: string,
  ) {}
}
