import { hash } from 'bcrypt'
import { User } from '../../entities/user.entity.js'
import { UserMapper } from '../../mappers/user.mapper.js'
import { type UserEntity } from '../../../../core/entites/user.entity.js'
import { type UserRepository } from '../../../../core/repositories/UserRepository/user.repository.js'
import { type EditBodyDto } from '../../../../core/repositories/UserRepository/dtos/edit-body.dto.js'
import { BeAnObject } from '@typegoose/typegoose/lib/types'
import { ReturnModelType } from '@typegoose/typegoose'

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userRepository: ReturnModelType<typeof User, BeAnObject>) {}

  async getOneById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ uuid: userId })
    if (!user) {
      throw Error('Такого пользователя не существует')
    }
    return UserMapper.toDomain(user)
  }

  async editOne(userId: string, editBody: EditBodyDto): Promise<void> {
    const user = await this.userRepository.findOne({ uuid: userId })
    if (!user) {
      throw Error('Такого пользователя не существует')
    }
    let hashedPassword = editBody.password
    if ('password' in editBody) {
      hashedPassword = await hash(editBody.password, 4)
    }
    await this.userRepository.findOneAndUpdate({ uuid: userId }, { ...editBody, password: hashedPassword })
  }

  async removeOne(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ uuid: userId })
    if (!user) {
      throw Error('Такого пользователя не существует')
    }
    await this.userRepository.deleteOne({ uuid: userId })
  }
}
