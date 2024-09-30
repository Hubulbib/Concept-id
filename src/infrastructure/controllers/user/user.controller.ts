import { UploadedFile } from 'express-fileupload'
import { type NextFunction, type Response } from 'express'
import { FactoryRepositories } from '../../db/repositories'
import { UserService } from '../../../core/services/user.service.js'
import { StorageService } from '../../../core/services/storage.service.js'
import { type IAuthRequest } from '../../interfaces/auth.request.interface.js'
import { type EditBodyDto } from '../../../core/repositories/user/dtos/edit-body.dto.js'
import { StorageRepositoryImpl } from '../../storage/repositories/storage.repository.impl.js'

class UserController {
  constructor(readonly userService: UserService) {}

  getOneById = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const userId = req.user.uuid
      const userData = await this.userService.getOneById(userId, id)
      res.json(userData)
    } catch (err) {
      next(err)
    }
  }

  editOne = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const userBody: EditBodyDto = req.body
      const userId = req.user.uuid
      await this.userService.editOne(userId, id, userBody)
      res.end()
    } catch (err) {
      next(err)
    }
  }

  editAvatar = async (
    req: IAuthRequest & { files: { avatar: UploadedFile } },
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { avatar } = req.files
      const userId = req.user.uuid
      await this.userService.editAvatar(userId, avatar)
      res.json(200).end()
    } catch (err) {
      next(err)
    }
  }

  removeOne = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const userId = req.user.uuid
      await this.userService.removeOne(userId, id)
      res.end()
    } catch (err) {
      next(err)
    }
  }
}

export default new UserController(
  new UserService(FactoryRepositories.createUserRepositoryImpl(), new StorageService(new StorageRepositoryImpl())),
)
