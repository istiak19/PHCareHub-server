import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.get("/", checkAuth(role.doctor, role.admin), scheduleController.scheduleForDoctor);
router.post("/create-schedule", checkAuth(role.admin), scheduleController.createSchedule);
router.delete("/:id", checkAuth(role.admin), scheduleController.deleteSchedule);

export const scheduleRouter = router;