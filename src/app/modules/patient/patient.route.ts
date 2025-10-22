import { Router } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";
import { patientController } from "./patient.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";

const router = Router();

router.get("/", patientController.getAllPatient);
router.post("/create-patient", fileUploader.upload.single("file"), validateRequest(UserValidation.createPatientValidation), patientController.createPatient);
router.get("/:id", patientController.getByPatient);
router.patch("/:id", checkAuth(role.patient), patientController.updatePatient);
router.patch("/profile/:id", checkAuth(role.patient), fileUploader.upload.single("file"), patientController.updatePatientProfile);
router.delete("/:id", checkAuth(role.admin), patientController.deletePatient);

export const patientRouter = router;