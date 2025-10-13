import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

// router.get("/", scheduleController.scheduleForDoctor);
router.post("/create-doctor-schedule", checkAuth(role.doctor), doctorScheduleController.createDoctorSchedule);
// router.delete("/:id", scheduleController.deleteSchedule);

export const doctorScheduleRouter = router;