import { type AuthRepository } from '../repositories/auth/auth.repository.js'
import { type SignUpDto } from '../repositories/auth/dtos/sign-up.dto.js'
import { type SignInDto } from '../repositories/auth/dtos/sign-in.dto.js'
import { type DetailDto } from '../repositories/auth/dtos/detail.dto.js'
import { type RefreshDto } from '../repositories/auth/dtos/refresh.dto.js'
import { type AuthBackDto } from '../repositories/auth/dtos/auth-back.dto.js'
import { BrokerService } from './broker.service.js'

export class AuthService {
  constructor(
    private readonly apiURL: string,
    private readonly authRepository: AuthRepository,
    private readonly brokerService: BrokerService,
  ) {}

  public signIn = async (signInDto: SignInDto, detail: DetailDto): Promise<AuthBackDto> => {
    return await this.authRepository.signIn(signInDto, detail)
  }

  public signUp = async (signUpDto: SignUpDto, detail: DetailDto): Promise<AuthBackDto> => {
    const authData = await this.authRepository.signUp(signUpDto, detail)
    const data = {
      to: authData.user.email,
      link: `${this.apiURL}/api/auth/activate/${authData.activationLink}`,
    }
    await this.brokerService.sendToQueue('mailQueue', data)
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
