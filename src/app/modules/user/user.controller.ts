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

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const user = await userService.getMyProfile(decodedToken.email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My profile retrieved successfully!",
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

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.user as JwtPayload;
    const id = req.params.id;
    const user = await userService.changeProfileStatus(userInfo, id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile status changed!",
        data: user
    });
});

const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.user as JwtPayload;
    const id = req.params.id;
    const user = await userService.updateAdminProfile(userInfo, id, req);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Admin profile update successfully!",
        data: user
    });
});

export const userController = {
    getAllUser,
    getMyProfile,
    getByUser,
    createAdmin,
    createDoctor,
    updateAdminProfile,
    changeProfileStatus
};