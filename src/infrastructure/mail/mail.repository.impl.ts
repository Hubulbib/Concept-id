import { createTransport } from 'nodemailer'
import { MailRepository } from '../../core/repositories/mail/mail.repository.js'
import { SendActivationDto } from '../../core/repositories/mail/dtos/send-activation.dto.js'

export class MailRepositoryImpl implements MailRepository {
  constructor(
    private readonly transport = createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  ) {}

  async sendActivationMail(sendActivationDto: SendActivationDto): Promise<void> {
    await this.transport.sendMail({
      from: process.env.SMTP_USER,
      to: sendActivationDto.to,
      subject: sendActivationDto.subject,
      text: sendActivationDto.text,
      html: sendActivationDto.html,
    })
  }
}
