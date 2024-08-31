import { Router } from 'express'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware/auth.middleware.js'
import userController from '../../controllers/UserController/user.controller.js'

const router = Router()

router.get('/:id', [AuthMiddleware], userController.getOneById)

router.put('/:id', [AuthMiddleware], userController.editOne)

router.delete('/:id', [AuthMiddleware], userController.removeOne)

export default router
