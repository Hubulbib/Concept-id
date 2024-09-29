import { ConsumerBroker } from './consumer.broker'
import { MailRepositoryImpl } from '../mail/mail.repository.impl'
import { MailService } from '../../core/services/mail/mail.service.js'

export const brokerConnect = async () => {
  const brokerUri = process.env.BROKER_CLIENT
  try {
    await new ConsumerBroker(brokerUri, new MailService(new MailRepositoryImpl())).connect()
    console.log({ msg: 'broker.connected', data: { uri: brokerUri } })
  } catch (err) {
    console.log({ msg: 'broker.failed', err })
  }
}
