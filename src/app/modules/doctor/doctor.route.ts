import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";
import { doctorController } from "./doctor.controller";

const router = Router();

router.post("/suggestion", doctorController.getAISuggestions);
router.get("/", checkAuth(role.admin, role.doctor, role.patient), doctorController.getAllDoctor);
router.get("/:id", checkAuth(role.admin, role.doctor, role.patient), doctorController.getByDoctor);
router.patch("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

export const doctorRouter = router;