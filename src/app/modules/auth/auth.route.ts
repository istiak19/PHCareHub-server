import { role } from './../../../constants/roles';
import { checkAuth } from './../../middlewares/checkAuth';
import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.get("/me", checkAuth(role.admin, role.doctor, role.patient), authController.getMeUser);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export const authRouter = router;