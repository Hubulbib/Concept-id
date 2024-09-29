import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/auth.middleware.js'
import { AuthValidator } from '../validators/auth.validator.js'
import authController from '../controllers/auth/auth.controller.js'

const router = Router()

router.post('/sign-in', AuthValidator.SignIn, authController.signIn)

router.post('/sign-up', AuthValidator.SignUp, authController.signUp)

router.post('/refresh', AuthValidator.Refresh, authController.refresh)

router.post('/logout', [AuthMiddleware, AuthValidator.Logout], authController.logout)

router.get('/activate/:link', authController.activate)

export default router
