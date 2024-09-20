export class EditBodyDto {
  constructor(
    readonly username?: string,
    readonly phone?: string,
    readonly password?: string,
    readonly email?: string,
    readonly name?: string,
    readonly surname?: string,
    readonly gender?: string,
    readonly dateBirthday?: Date,
    readonly avatar?: string,
  ) {}
}
