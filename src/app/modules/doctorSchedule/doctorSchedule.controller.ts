import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from '../../helpers/pick';
import { JwtPayload } from 'jsonwebtoken';
import { doctorScheduleService } from './doctorSchedule.service';

const createDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const info = req.body;
    const schedule = await doctorScheduleService.createDoctorSchedule(decodedToken, info);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Doctor schedule created successfully!",
        data: schedule
    });
});

// const scheduleForDoctor = catchAsync(async (req: Request, res: Response) => {
//     const decodedToken = req.user as JwtPayload;
//     const filters = pick(req.query, ["startDateTime", "endDateTime"])
//     const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
//     const schedule = await scheduleService.scheduleForDoctor(decodedToken, filters, options);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "Schedule retrieved successfully!",
//         data: schedule
//     });
// });

// const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
//     const decodedToken = req.user as JwtPayload;
//     const id = req.params.id;
//     const schedule = await scheduleService.deleteSchedule(decodedToken, id);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "Schedule delete successfully!",
//         data: schedule
//     });
// });

export const doctorScheduleController = {
    createDoctorSchedule
};