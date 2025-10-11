import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userService } from './user.service';

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.body;
    const user = await userService.createPatient(userInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Patient created successfully!",
        data: user
    });
});

export const userController = {
    createPatient,
};