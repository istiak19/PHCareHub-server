import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.get("/", checkAuth(role.doctor, role.admin), scheduleController.scheduleForDoctor);
router.post("/create-schedule", scheduleController.createSchedule);
router.delete("/:id", scheduleController.deleteSchedule);

export const scheduleRouter = router;