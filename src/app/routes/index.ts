import express from 'express';
import { userRouter } from '../modules/user/user.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRouter
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;