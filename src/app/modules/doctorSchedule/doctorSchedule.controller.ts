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

const getAllDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const filters = pick(req.query, ['searchTerm', 'isBook', 'doctorId']);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const schedule = await doctorScheduleService.getAllDoctorSchedule(decodedToken, filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor schedules retrieved successfully!",
        data: schedule
    });
});

const getDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const filters = pick(req.query, ['startDate', 'endDate', 'isBook']);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const schedule = await doctorScheduleService.getDoctorSchedule(decodedToken, filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My doctor schedule retrieved successfully!",
        data: schedule
    });
});

const deleteDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const id = req.params.id;
    const schedule = await doctorScheduleService.deleteDoctorSchedule(decodedToken, id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor schedule delete successfully!",
        data: schedule
    });
});

export const doctorScheduleController = {
    createDoctorSchedule,
    getAllDoctorSchedule,
    getDoctorSchedule,
    deleteDoctorSchedule
};