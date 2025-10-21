import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { role } from '../../../constants/roles';
import { prescriptionController } from './prescription.controller';

const router = Router();


router.post("/", checkAuth(role.doctor), prescriptionController.createPrescription);
router.get("/my-prescription", checkAuth(role.patient), prescriptionController.getMyPrescription);
router.get("/my-prescription/:id", checkAuth(role.patient), prescriptionController.getByMyPrescription);

export const prescriptionRouter = router;