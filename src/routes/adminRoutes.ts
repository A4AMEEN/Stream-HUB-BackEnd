import { Router } from 'express';
import { AdminRepository } from '../repositories/AdminRepository'; 
import { AdminInteractor } from '../interactors/AdminInteractor';
import { AdminController } from '../controllers/AdminController';

const router=Router()

const repository= new AdminRepository()
const interactor =new AdminInteractor(repository)
const controller = new AdminController(interactor)


router.get('/users',controller.getUsers.bind(controller))
router.put('/blockuser/:id',controller.onBlockUser.bind(controller))
router.post('/addCategory',controller.addCategory.bind(controller))
router.get('/categories',controller.getCategory.bind(controller))
router.put('/updateCategory/:id', controller.updateCategory.bind(controller));
router.delete('/deleteCategory/:id', controller.deleteCategory.bind(controller));



export default router