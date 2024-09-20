import { Router } from 'express'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware/auth.middleware.js'
import userController from '../../controllers/UserController/user.controller.js'
import fileUpload from 'express-fileupload'
import { UserValidator } from '../../validators/user.validator'

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
