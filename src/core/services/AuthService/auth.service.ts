import { type AuthRepository } from '../../repositories/AuthRepository/auth.repository.js'
import { type SignUpDto } from '../../repositories/AuthRepository/dtos/sign-up.dto.js'
import { type SignInDto } from '../../repositories/AuthRepository/dtos/sign-in.dto.js'
import { type DetailDto } from '../../repositories/AuthRepository/dtos/detail.dto.js'
import { type RefreshDto } from '../../repositories/AuthRepository/dtos/refresh.dto.js'
import { type AuthBackDto } from '../../repositories/AuthRepository/dtos/auth-back.dto'
import { BrokerRepository } from '../../repositories/BrokerRepository/broker.repository'

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly brokerRepository: BrokerRepository,
  ) {}

  public signIn = async (signInDto: SignInDto, detail: DetailDto): Promise<AuthBackDto> => {
    return await this.authRepository.signIn(signInDto, detail)
  }

  public signUp = async (signUpDto: SignUpDto, detail: DetailDto): Promise<AuthBackDto> => {
    const authData = await this.authRepository.signUp(signUpDto, detail)
    const data = {
      to: authData.user.email,
      link: `${process.env.API_URL}/api/auth/activate/${authData.activationLink}`,
    }
    await this.brokerRepository.sendToQueue('mailQueue', data)
    return authData
  }

  public refresh = async (refreshDto: RefreshDto, detail: DetailDto): Promise<AuthBackDto> => {
    return await this.authRepository.refresh(refreshDto, detail)
  }

  public logout = async (refreshToken: string): Promise<void> => {
    await this.authRepository.logout(refreshToken)
  }

  public activate = async (activationLink: string): Promise<void> => {
    await this.authRepository.activate(activationLink)
  }
}
