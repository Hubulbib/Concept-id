import { SendActivationDto } from './dtos/send-activation.dto.js'

export interface MailRepository {
  sendActivationMail: (sendActivationDto: SendActivationDto) => Promise<void>
}
