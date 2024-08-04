import { type UserRepository } from '../../repositories/UserRepository/user.repository.js'
import { type EditBodyDto } from '../../repositories/UserRepository/dtos/edit-body.dto.js'
import { type UserEntity } from '../../entites/user.entity'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getAll = async (): Promise<UserEntity[]> => {
    return await this.userRepository.getAll()
  }

  getOneById = async (userId: string): Promise<UserEntity> => {
    return await this.userRepository.getOneById(userId)
  }

  editOne = async (userId: string, editBody: EditBodyDto): Promise<void> => {
    await this.userRepository.editOne(userId, editBody)
  }

  removeOne = async (userId: string): Promise<void> => {
    await this.userRepository.removeOne(userId)
  }
}
