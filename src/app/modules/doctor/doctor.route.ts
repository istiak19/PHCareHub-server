import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/doctor", checkAuth(role.admin, role.doctor, role.patient), doctorController.getAllDoctor);
router.patch("/:id", doctorController.updateDoctor);

export const doctorRouter = router;