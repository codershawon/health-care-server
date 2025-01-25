import express, { NextFunction } from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';

const router = express.Router();
router.get('/', adminController.getAllFromDB)
router.get('/:id', adminController.getByIdFromDB)
router.patch('/:id',  
    validateRequest(adminValidationSchemas.update),
    adminController.updateIntoDB)
router.delete('/:id', adminController.deleteFromDB)
router.delete('/soft/:id', adminController.softDeleteFromDB)

export const adminRoutes = router;