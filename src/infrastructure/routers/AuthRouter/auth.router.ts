import { Router } from 'express'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware/auth.middleware.js'
import { SignInValidator } from './validators/sign-in.validator.js'
import { SignUpValidator } from './validators/sign-up.validator.js'
import { RefreshValidator } from './validators/refresh.validator.js'
import { LogoutValidator } from './validators/logout.validator.js'
import authController from '../../controllers/AuthController/auth.controller.js'

const router = Router()

router.post('/sign-in', SignInValidator, authController.signIn)

router.post('/sign-up', SignUpValidator, authController.signUp)

router.post('/refresh', RefreshValidator, authController.refresh)

router.post('/logout', [AuthMiddleware, ...LogoutValidator], authController.logout)

export default router
