import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.get("/me", authController.getMeUser);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);

export const authRouter = router;