import express, { NextFunction } from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();
router.get('/', 
    auth(Role.SUPER_ADMIN, Role.ADMIN), 
    adminController.getAllFromDB)
router.get('/:id', 
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    adminController.getByIdFromDB)
router.patch('/:id',  
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(adminValidationSchemas.update),
    adminController.updateIntoDB)
router.delete('/:id', 
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    adminController.deleteFromDB)
router.delete('/soft/:id', 
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    adminController.softDeleteFromDB)

export const adminRoutes = router;