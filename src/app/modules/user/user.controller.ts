import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userService } from './user.service';
import pick from '../../helpers/pick';
import { doctorFilterableFields, userFilterableFields } from './user.constant';
import { JwtPayload } from 'jsonwebtoken';

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

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
    const user = await userService.getAllPatient(filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Patients retrieved successfully!",
        data: user
    });
});

const getMeUser = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const user = await userService.getMeUser(decodedToken.email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User retrieved successfully!",
        data: user
    });
});

const getByUser = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const id = req.params.id;
    const user = await userService.getByUser(decodedToken, id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User retrieved successfully!",
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
    getMeUser,
    getByUser,
    getAllPatient,
    createPatient,
    createAdmin,
    createDoctor,
};