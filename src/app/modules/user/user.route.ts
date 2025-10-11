import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/create-patient", userController.createPatient);

export const userRouter = router;