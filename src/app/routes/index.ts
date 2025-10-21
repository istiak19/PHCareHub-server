import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { scheduleRouter } from '../modules/schedule/schedule.route';
import { doctorScheduleRouter } from '../modules/doctorSchedule/doctorSchedule.route';
import { SpecialtiesRoute } from '../modules/specialties/specialties.route';
import { doctorRouter } from '../modules/doctor/doctor.route';
import { patientRouter } from '../modules/patient/patient.route';
import { appointmentRouter } from '../modules/appointment/appointment.route';
import { prescriptionRouter } from '../modules/prescription/prescription.route';
import { reviewRouter } from '../modules/review/review.route';


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
    },
    {
        path: "/doctor",
        route: doctorRouter
    },
    {
        path: "/patient",
        route: patientRouter
    },
    {
        path: "/appointment",
        route: appointmentRouter
    },
    {
        path: "/prescription",
        route: prescriptionRouter
    },
    {
        path: "/review",
        route: reviewRouter
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;