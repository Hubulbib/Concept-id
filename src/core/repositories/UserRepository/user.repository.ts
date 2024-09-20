import { type UserEntity } from '../../entites/user.entity.js'
import { type EditBodyDto } from './dtos/edit-body.dto.js'
import { type UploadedFile } from 'express-fileupload'

export interface UserRepository {
  getOneById: (userId: string) => Promise<UserEntity>
  editOne: (userId: string, editBody: EditBodyDto) => Promise<void>
  editAvatar: (userId: string, avatar: UploadedFile) => Promise<void>
  removeOne: (userId: string) => Promise<void>
}
