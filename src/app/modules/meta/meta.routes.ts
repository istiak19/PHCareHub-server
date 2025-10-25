import { Router } from "express";
import { metaController } from "./meta.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { role } from "../../../constants/roles";

const router = Router();

router.get("/", checkAuth(role.admin, role.doctor, role.patient), metaController.fetchDashboardMetaData);

export const metaDataRouter = router;