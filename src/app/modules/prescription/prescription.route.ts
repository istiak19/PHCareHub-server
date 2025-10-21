import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { role } from '../../../constants/roles';
import { prescriptionController } from './prescription.controller';

const router = Router();


router.post("/", checkAuth(role.doctor), prescriptionController.createPrescription);

export const prescriptionRouter = router;