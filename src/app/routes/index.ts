import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { scheduleRouter } from '../modules/schedule/schedule.route';
import { doctorScheduleRouter } from '../modules/doctorSchedule/doctorSchedule.route';
import { SpecialtiesRoute } from '../modules/specialties/specialties.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/schedule",
        route: scheduleRouter
    },
    {
        path: "/doctor-schedule",
        route: doctorScheduleRouter
    },
    {
        path: "/specialties",
        route: SpecialtiesRoute
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;