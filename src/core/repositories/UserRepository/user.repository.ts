import { type UserEntity } from '../../entites/user.entity.js'
import { type EditBodyDto } from './dtos/edit-body.dto.js'

export interface UserRepository {
  getAll: () => Promise<UserEntity[]>
  getOneById: (userId: string) => Promise<UserEntity>
  editOne: (userId: string, editBody: EditBodyDto) => Promise<void>
  removeOne: (userId: string) => Promise<void>
}
