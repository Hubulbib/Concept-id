import { createTransport } from 'nodemailer'
import 'dotenv/config.js'

export class MailService {
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

  async sendActivationMail(to: string, link: string): Promise<void> {
    await this.transport.sendMail({
      to,
      from: process.env.SMTP_USER,
      subject: 'Активация аккаунта ConceptID',
      text: '',
      html: `
              <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
              </div>
            `,
    })
  }
}
