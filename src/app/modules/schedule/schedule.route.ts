import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.get("/", scheduleController.scheduleForDoctor);
router.post("/create-schedule", scheduleController.createSchedule);

export const scheduleRouter = router;