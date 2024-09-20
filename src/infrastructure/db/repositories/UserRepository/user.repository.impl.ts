import { hash } from 'bcrypt'
import { userModel } from '../../entities/user.entity.js'
import { UserMapper } from '../../mappers/user.mapper.js'
import { type UserEntity } from '../../../../core/entites/user.entity.js'
import { type UserRepository } from '../../../../core/repositories/UserRepository/user.repository.js'
import { type EditBodyDto } from '../../../../core/repositories/UserRepository/dtos/edit-body.dto.js'
import { StorageRepositoryImpl } from '../../../storage/repositories/storage.repository.impl'
import { UploadedFile } from 'express-fileupload'
import { StorageService } from '../../../../core/services/StorageService/storage.service'

export class UserRepositoryImpl implements UserRepository {
  private readonly userRepository = userModel

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

  async editAvatar(userId: string, avatar: UploadedFile): Promise<void> {
    const url = await new StorageService(new StorageRepositoryImpl()).uploadFile(avatar)
    await userModel.findByIdAndUpdate(userId, { avatar: url })
  }

  async removeOne(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ uuid: userId })
    if (!user) {
      throw Error('Такого пользователя не существует')
    }
    await this.userRepository.deleteOne({ uuid: userId })
  }
}
