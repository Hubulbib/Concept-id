export class SignUpDto {
  constructor(
    readonly username: string,
    readonly email: string,
    readonly password: string,
    readonly name?: string,
    readonly surname?: string,
    readonly gender?: string,
    readonly phone?: string,
    readonly dateBirthday?: Date,
    readonly avatar?: string,
  ) {}
}
