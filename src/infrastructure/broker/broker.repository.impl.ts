import * as amqp from 'amqplib'
import { BrokerRepository } from '../../core/repositories/broker/broker.repository.js'
import 'dotenv/config.js'

export class BrokerRepositoryImpl implements BrokerRepository {
  constructor(private channel: amqp.Channel | null = null) {}

  async connect() {
    if (!this.channel) {
      const maxAttempts = 5
      const delay = 2500

      for (let attempts = 1; attempts <= maxAttempts; attempts++) {
        try {
          const connection = await amqp.connect(process.env.BROKER_CLIENT)
          this.channel = await connection.createChannel()
          return
        } catch (error) {
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, delay))
          } else {
            throw Error('Broker failed to start')
          }
        }
      }
    }
  }

  async sendToQueue(queueName: string, data: any): Promise<void> {
    await this.connect()
    await this.channel?.assertQueue(queueName, { durable: true })
    this.channel?.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true })
  }
}
