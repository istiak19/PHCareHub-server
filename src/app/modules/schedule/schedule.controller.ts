import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { scheduleService } from './schedule.service';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const schedule = await scheduleService.createSchedule(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Schedule created successfully!",
        data: schedule
    });
});

export const scheduleController = {
    createSchedule
};