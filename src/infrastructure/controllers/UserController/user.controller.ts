import { type NextFunction, type Response } from 'express'
import { type IAuthRequest } from '../../interfaces/auth.request.interface.js'
import { UserService } from '../../../core/services/UserService/user.service.js'
import { type EditBodyDto } from '../../../core/repositories/UserRepository/dtos/edit-body.dto.js'
import { UserRepositoryImpl } from '../../db/repositories/UserRepository/user.repository.impl.js'

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

export default new UserController(new UserService(new UserRepositoryImpl()))
