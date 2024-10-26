import { ConsumerBroker } from './consumer.broker.js'
import { MailRepositoryImpl } from '../mail/mail.repository.impl.js'
import { MailService } from '../../core/services/mail.service.js'

export const brokerConnect = async () => {
  const brokerUri = process.env.BROKER_CLIENT
  try {
    await new ConsumerBroker(brokerUri, new MailService(new MailRepositoryImpl())).connect()
    console.log({ msg: 'broker.connected' })
  } catch (err) {
    console.log({ msg: 'broker.failed', err })
  }
}
