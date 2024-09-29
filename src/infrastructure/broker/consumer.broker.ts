import * as amqp from 'amqplib'
import { MailService } from '../../core/services/mail/mail.service.js'
import 'dotenv/config.js'

export class ConsumerBroker {
  constructor(
    private readonly brokerUri: string,
    private readonly mailService: MailService,
    private channel: amqp.Channel | null = null,
  ) {}

  async connect() {
    const connection = await amqp.connect(this.brokerUri)
    this.channel = await connection.createChannel()
    await this.channel.assertQueue('mailQueue', { durable: true })

    this.channel.consume('mailQueue', async (msg) => {
      if (msg !== null) {
        const { to, link } = JSON.parse(msg.content.toString())
        await this.mailService.sendActivationMail(to, link)
        this.channel?.ack(msg)
      }
    })
  }
}
