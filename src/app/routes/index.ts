import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { scheduleRouter } from '../modules/schedule/schedule.route';


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
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;