import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.get("/", scheduleController.scheduleForDoctor);
router.post("/create-schedule", scheduleController.createSchedule);
router.delete("/:id", scheduleController.deleteSchedule);

export const scheduleRouter = router;