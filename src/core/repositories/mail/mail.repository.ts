import { SendActivationDto } from './dtos/send-activation.dto'

export interface MailRepository {
  sendActivationMail: (sendActivationDto: SendActivationDto) => Promise<void>
}
