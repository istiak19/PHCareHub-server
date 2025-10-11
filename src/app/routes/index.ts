import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRouter } from '../modules/user/auth/auth.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/user",
        route: userRouter
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;