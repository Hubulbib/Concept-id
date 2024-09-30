import { BrokerRepository } from '../repositories/broker/broker.repository.js'

export class BrokerService {
  constructor(private readonly brokerRepository: BrokerRepository) {}

  sendToQueue = async (queueName: string, data: any) => {
    await this.brokerRepository.sendToQueue(queueName, data)
  }
}
