import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../repositories/UserRepository';
import { userInteractor } from '../interactors/UserInteractor';
import { AdminController } from '../controllers/AdminController';

const router = Router();

const repository=new UserRepository()
const interactor=new userInteractor(repository)
const controller=new UserController(interactor)


router.post('/signup', controller.signup.bind(controller));
router.post('/login', controller.login.bind(controller));
router.post('/send-otp',controller.sendOtp.bind(controller))
router.post('/verify-otp',controller.verify.bind(controller))
router.post('/reset-password', controller.resetPassword.bind(controller));
router.post('/forgot-password', controller.forgotPassword.bind(controller)); 




export default router;
