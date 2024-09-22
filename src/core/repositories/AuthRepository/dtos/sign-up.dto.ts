export class SignUpDto {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly name?: string,
    readonly surname?: string,
    readonly gender?: string,
    readonly phone?: string,
    readonly dateBirthday?: Date,
  ) {}
}
