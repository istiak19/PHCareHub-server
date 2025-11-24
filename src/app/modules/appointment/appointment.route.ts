import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.get("/", checkAuth(role.admin), appointmentController.getAllAppointment);
router.get("/my-appointments", checkAuth(role.patient, role.doctor), appointmentController.getMyAppointment);
router.post("/", checkAuth(role.patient), appointmentController.createAppointment);
router.get("/:id", checkAuth(role.admin, role.doctor, role.patient), appointmentController.getAppointmentById);
router.patch("/:id", checkAuth(role.doctor, role.admin), appointmentController.updateStatusAppointment);

export const appointmentRouter = router;