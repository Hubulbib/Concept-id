import { MailRepository } from '../../repositories/mail/mail.repository.js'
import 'dotenv/config.js'

export class MailService {
  constructor(private readonly mailRepository: MailRepository) {}

  async sendActivationMail(to: string, link: string): Promise<void> {
    await this.mailRepository.sendActivationMail({
      to,
      link,
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
