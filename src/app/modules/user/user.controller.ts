import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userService } from './user.service';
import pick from '../../helpers/pick';
import { userFilterableFields } from './user.constant';

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
    const user = await userService.getAllUser(filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully!",
        data: user
    });
});

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
    getAllUser,
    createPatient,
    createAdmin,
    createDoctor
};