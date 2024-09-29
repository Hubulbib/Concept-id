import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { AuthMiddleware } from '../middlewares/auth.middleware.js'
import userController from '../controllers/user/user.controller.js'
import { UserValidator } from '../validators/user.validator.js'

const router = Router()

router.get('/:id', [AuthMiddleware], userController.getOneById)

router.patch('/:id', [AuthMiddleware], userController.editOne)

router.patch(
  '/:id/avatar',
  [
    AuthMiddleware,
    fileUpload({
      limits: { fileSize: 10 ** 8 },
    }),
    UserValidator.editAvatar,
  ],
  userController.editAvatar,
)

router.delete('/:id', [AuthMiddleware], userController.removeOne)

export default router
