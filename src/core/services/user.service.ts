import { type UploadedFile } from 'express-fileupload'
import { type UserEntity } from '../entites/user.entity.js'
import { StorageService } from './storage.service.js'
import { ApiError } from '../../infrastructure/exceptions/api.exception.js'
import { type UserRepository } from '../repositories/user/user.repository.js'
import { type EditBodyDto } from '../repositories/user/dtos/edit-body.dto.js'

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageService,
  ) {}

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
    const url = await this.storageService.uploadFile(avatar)
    await this.userRepository.editOne(userId, { avatar: url })
  }

  removeOne = async (authId: string, userId: string): Promise<void> => {
    if (authId !== userId) {
      throw ApiError.NotAccess()
    }
    await this.userRepository.removeOne(userId)
  }
}
