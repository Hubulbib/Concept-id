import { compare, hash } from 'bcrypt'
import { genUuid } from '../../../utils/generate.js'
import { UserMapper } from '../../mappers/user.mapper.js'
import { ApiError } from '../../../exceptions/api.exception.js'
import { MailRepository } from '../MailRepository/mail.repository'
import { type User, userModel } from '../../entities/user.entity.js'
import { SessionRepositoryImpl } from '../TokenReposiory/session.repository.impl.js'
import { type DetailDto } from '../../../../core/repositories/AuthRepository/dtos/detail.dto.js'
import { type SignInDto } from '../../../../core/repositories/AuthRepository/dtos/sign-in.dto.js'
import { type SignUpDto } from '../../../../core/repositories/AuthRepository/dtos/sign-up.dto.js'
import { type RefreshDto } from '../../../../core/repositories/AuthRepository/dtos/refresh.dto.js'
import { type AuthBackDto } from '../../../../core/repositories/AuthRepository/dtos/auth-back.dto.js'
import { type AuthRepository } from '../../../../core/repositories/AuthRepository/auth.repository.js'
import { EUserRole } from '../../entities/enums/user-role.enum'
import 'dotenv/config.js'

export class AuthRepositoryImpl implements AuthRepository {
  // TODO: refactoring by constructor
  private readonly userRepository = userModel
  private readonly sessionRepository = new SessionRepositoryImpl()

  public signUp = async (signUpDto: SignUpDto, detail: DetailDto): Promise<AuthBackDto> => {
    const candidate = await this.userRepository.findOne({ email: signUpDto.email })
    if (candidate) {
      throw ApiError.BadRequest('Пользователь с таким email уже существует')
    }
    const device = {
      ...detail,
      uuid: genUuid(),
    }
    const activationLink = genUuid()
    const hashedPassword = await hash(signUpDto.password, 4)
    const user = await this.userRepository.create({
      ...signUpDto,
      uuid: genUuid(),
      password: hashedPassword,
      devices: [device],
      activationLink,
    })

    await new MailRepository().sendActivationMail(
      signUpDto.email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`,
    )

    return await this.responseData(user, device.uuid)
  }

  public signIn = async (signInDto: SignInDto, detail: DetailDto): Promise<AuthBackDto> => {
    const user = await this.userRepository.findOne({ email: signInDto.email })
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким username не найден')
    }
    const comparePassword = await compare(signInDto.password, user.password)
    if (!comparePassword) {
      throw ApiError.BadRequest('Неверные данные при входе')
    }
    const device = user.devices.find((e) => e.ua === detail.ua && e.ip === detail.ip)

    console.log('device >', device)

    if (!device) {
      // create device for user
      const uuidDevice = genUuid()
      await this.userRepository.updateOne(
        {
          uuid: user.uuid,
        },
        {
          $push: {
            devices: {
              ...detail,
              uuid: uuidDevice,
            },
          },
        },
      )

      return await this.responseData(user, uuidDevice)
    }

    console.log('user.uuid >', user.uuid)

    const session = await this.sessionRepository.findSessionByIds({ uuidDevice: device.uuid, uuidUser: user.uuid })

    console.log('session >', session) // после /logout -> null

    return {
      refreshToken: session.refreshToken.token,
      accessToken: session.accessToken.token,
      user: UserMapper.toDomain(user),
    }
  }

  public logout = async (refreshToken: string): Promise<void> => {
    const session = await this.sessionRepository.findSessionByRefresh(refreshToken)
    if (!session) {
      throw new Error('logout.session.notFound')
    }
    const user = await this.userRepository.findOne({ uuid: session.ids.uuidUser })
    if (!user) {
      throw new Error('logout.user.notFound')
    }
    await this.userRepository.updateOne(
      {
        uuid: user.uuid,
      },
      {
        $set: { devices: user.devices.filter((e) => e.uuid !== session.ids.uuidDevice) },
      },
    )
    await this.sessionRepository.removeSessionByRefresh(refreshToken)
  }

  public refresh = async (refreshDto: RefreshDto, detail: DetailDto): Promise<AuthBackDto> => {
    if (!refreshDto.refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = this.sessionRepository.validateRefreshToken(refreshDto.refreshToken)
    const session = await this.sessionRepository.findSessionByRefresh(refreshDto.refreshToken)
    if (!userData || !session) {
      //throw Error('userdata || db Пользователь не авторизован')
      throw ApiError.UnauthorizedError()
    }
    const user = await this.userRepository.findOne({ uuid: session.ids.uuidUser })
    const device = user.devices.find((e) => e.ua === detail.ua && e.ip === detail.ip)
    // remove session for creating new
    await this.sessionRepository.removeSessionByRefresh(refreshDto.refreshToken)

    return await this.responseData(user, device.uuid)
  }

  public activate = async (activationLink: string): Promise<void> => {
    const user = await this.userRepository.findOne({ activationLink })
    if (user.role != EUserRole.unverified) {
      throw ApiError.BadRequest('Пользователь уже активирован')
    }
    if (!user) {
      throw ApiError.BadRequest('Неверная ссылка активации')
    }
    user.role = EUserRole.user
    await user.save()
  }

  private readonly responseData = async (userData: User, uuidDevice: string): Promise<AuthBackDto> => {
    const tokens = this.sessionRepository.generateTokens({ ...userData })
    await this.sessionRepository.saveToken({ uuidUser: userData.uuid, tokens, uuidDevice })
    return {
      ...tokens,
      user: UserMapper.toDomain(userData),
    }
  }
}
