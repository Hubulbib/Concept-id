import * as amqp from 'amqplib'
import { BrokerRepository } from '../../core/repositories/BrokerRepository/broker.repository.js'
import 'dotenv/config.js'

export class BrokerRepositoryImpl implements BrokerRepository {
  constructor(private channel: amqp.Channel | null = null) {}

  async connect() {
    if (!this.channel) {
      const connection = await amqp.connect(process.env.BROKER_CLIENT)
      this.channel = await connection.createChannel()
    }
  }

  async sendToQueue(queueName: string, data: any): Promise<void> {
    await this.connect()
    await this.channel?.assertQueue(queueName, { durable: true })
    this.channel?.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true })
  }
}
