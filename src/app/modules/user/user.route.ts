import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helpers/fileUploader";

const router = Router();

router.post("/create-patient", fileUploader.upload.single("file"), validateRequest(UserValidation.createPatientValidation), userController.createPatient);
router.post("/create-admin", fileUploader.upload.single("file"), validateRequest(UserValidation.createAdminValidation), userController.createAdmin);
router.post("/create-doctor", fileUploader.upload.single("file"), validateRequest(UserValidation.createDoctorValidation), userController.createDoctor);

export const userRouter = router;