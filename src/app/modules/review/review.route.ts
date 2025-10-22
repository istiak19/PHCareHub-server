import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { role } from '../../../constants/roles';
import { reviewController } from './review.controller';

const router = Router();


router.post("/", checkAuth(role.patient), reviewController.createReview);
router.get("/", reviewController.getAllReview);
// router.get("/my-prescription/:id", checkAuth(role.patient), prescriptionController.getByMyPrescription);

export const reviewRouter = router;