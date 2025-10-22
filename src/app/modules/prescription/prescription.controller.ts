import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { prescriptionService } from './prescription.service';
import pick from '../../helpers/pick';

const createPrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const result = await prescriptionService.createPrescription(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription created successfully!",
        data: result
    });
});

const getMyPrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const options = pick(req.query, ["page", "limit"]);
    const result = await prescriptionService.getMyPrescription(user, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Prescriptions retrieved successfully!",
        data: result
    });
});

const getByMyPrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const id = req.params.id;
    const result = await prescriptionService.getByMyPrescription(user, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Prescription retrieved successfully!",
        data: result
    });
});

export const prescriptionController = {
    createPrescription,
    getMyPrescription,
    getByMyPrescription
};