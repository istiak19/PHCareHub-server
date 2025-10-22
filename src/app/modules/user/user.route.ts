import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helpers/fileUploader";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.get("/", checkAuth(role.admin), userController.getAllUser);
router.get("/me", checkAuth(role.admin, role.doctor, role.patient), userController.getMyProfile);
router.post("/create-admin", fileUploader.upload.single("file"), validateRequest(UserValidation.createAdminValidation), userController.createAdmin);
router.post("/create-doctor", fileUploader.upload.single("file"), validateRequest(UserValidation.createDoctorValidation), userController.createDoctor);
router.get("/:id", checkAuth(role.admin), userController.getByUser);
router.patch("/:id", checkAuth(role.admin), userController.changeProfileStatus);
router.patch("/profile/:id", checkAuth(role.admin), fileUploader.upload.single("file"), userController.updateAdminProfile);

export const userRouter = router;