import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.post("/", checkAuth(role.patient), appointmentController.createAppointment);

export const appointmentRouter = router;