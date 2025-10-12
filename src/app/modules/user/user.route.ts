import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helpers/fileUploader";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.get("/", checkAuth(role.admin), userController.getAllUser);
router.get("/doctor", checkAuth(role.admin), userController.getAllDoctor);
router.get("/patient", checkAuth(role.admin), userController.getAllPatient);
router.get("/me", checkAuth(role.admin,role.doctor,role.patient), userController.getMeUser);
router.post("/create-admin", fileUploader.upload.single("file"), validateRequest(UserValidation.createAdminValidation), userController.createAdmin);
router.post("/create-doctor", fileUploader.upload.single("file"), validateRequest(UserValidation.createDoctorValidation), userController.createDoctor);
router.get("/:id", checkAuth(role.admin), userController.getByUser);

export const userRouter = router;