import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helpers/fileUploader";

const router = Router();

router.post("/create-patient", fileUploader.upload.single("file"), validateRequest(UserValidation.createPatientValidation), userController.createPatient);

export const userRouter = router;