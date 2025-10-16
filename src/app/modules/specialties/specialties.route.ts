import express from 'express';
import { SpecialtiesController } from './specialties.controller';
import { fileUploader } from '../../helpers/fileUploader';
import { validateRequest } from '../../middlewares/validateRequest';
import { SpecialtiesValidation } from './specialties.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { role } from '../../../constants/roles';


const router = express.Router();

router.get("/", SpecialtiesController.getAllSpecialties);
router.post("/", fileUploader.upload.single("file"), validateRequest(SpecialtiesValidation.createSpecialties), SpecialtiesController.createSpecialties);
router.delete("/:id", checkAuth(role.admin), SpecialtiesController.deleteSpecialties);

export const SpecialtiesRoute = router;