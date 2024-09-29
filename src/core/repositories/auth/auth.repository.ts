import { type DetailDto } from './dtos/detail.dto.js'
import { type AuthBackDto } from './dtos/auth-back.dto.js'
import { type SignInDto } from './dtos/sign-in.dto.js'
import { type SignUpDto } from './dtos/sign-up.dto.js'
import { type RefreshDto } from './dtos/refresh.dto.js'

export interface AuthRepository {
  signIn: (signInDto: SignInDto, detail: DetailDto) => Promise<AuthBackDto>
  signUp: (signUpDto: SignUpDto, detail: DetailDto) => Promise<AuthBackDto>
  logout: (refreshToken: string) => Promise<void>
  activate: (activationLink: string) => Promise<void>
  refresh: (refreshDto: RefreshDto, detail: DetailDto) => Promise<AuthBackDto>
}
