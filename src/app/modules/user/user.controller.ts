import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userService } from './user.service';

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createPatient(req);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Patient created successfully!",
        data: user
    });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createAdmin(req);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Admin created successfully!",
        data: user
    });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createDoctor(req);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Doctor created successfully!",
        data: user
    });
});

export const userController = {
    createPatient,
    createAdmin,
    createDoctor
};