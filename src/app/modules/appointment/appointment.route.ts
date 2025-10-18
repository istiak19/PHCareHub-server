import { Router } from "express";
import { appointmentController } from "./appointment.controller";

const router = Router();

router.post("/", appointmentController.createAppointment);

export const appointmentRouter = router;