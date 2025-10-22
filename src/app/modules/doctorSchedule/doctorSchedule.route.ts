import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.get("/all-doctor-schedule", checkAuth(role.admin), doctorScheduleController.getAllDoctorSchedule);
router.get("/", checkAuth(role.doctor, role.patient), doctorScheduleController.getDoctorSchedule);
router.post("/create-doctor-schedule", checkAuth(role.doctor), doctorScheduleController.createDoctorSchedule);
router.delete("/:id", checkAuth(role.doctor), doctorScheduleController.deleteDoctorSchedule);

export const doctorScheduleRouter = router;