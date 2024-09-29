import { type UserRepository } from '../../repositories/UserRepository/user.repository.js'
import { type EditBodyDto } from '../../repositories/UserRepository/dtos/edit-body.dto.js'
import { type UserEntity } from '../../entites/user.entity'
import { type UploadedFile } from 'express-fileupload'
import { ApiError } from '../../../infrastructure/exceptions/api.exception'
import { StorageService } from '../StorageService/storage.service'
import { StorageRepositoryImpl } from '../../../infrastructure/storage/repositories/storage.repository.impl'
import { BrokerRepositoryImpl } from '../../../infrastructure/broker'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getOneById = async (authId: string, userId: string): Promise<UserEntity> => {
    if (authId !== userId) {
      throw ApiError.NotAccess()
    }
    return await this.userRepository.getOneById(userId)
  }

  editOne = async (authId: string, userId: string, editBody: EditBodyDto): Promise<void> => {
    if (authId !== userId) {
      throw ApiError.NotAccess()
    }
    await this.userRepository.editOne(userId, editBody)
  }

  editAvatar = async (userId: string, avatar: UploadedFile): Promise<void> => {
    const url = await new StorageService(new StorageRepositoryImpl(), new BrokerRepositoryImpl()).uploadFile(avatar)
    await this.userRepository.editOne(userId, { avatar: url })
  }

  removeOne = async (authId: string, userId: string): Promise<void> => {
    if (authId !== userId) {
      throw ApiError.NotAccess()
    }
    await this.userRepository.removeOne(userId)
  }
}
