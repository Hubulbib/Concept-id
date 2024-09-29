export class SendActivationDto {
  constructor(
    readonly to: string,
    readonly link: string,
    readonly subject: string,
    readonly text?: string,
    readonly html?: string,
  ) {}
}
