export interface BrokerRepository {
  connect: () => Promise<void>
  sendToQueue: (queueName: string, data: any) => Promise<void>
}
