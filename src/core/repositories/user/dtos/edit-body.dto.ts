export class EditBodyDto {
  constructor(
    readonly username?: string,
    readonly phone?: string,
    readonly password?: string,
    readonly email?: string,
    readonly avatar?: string,
  ) {}
}
