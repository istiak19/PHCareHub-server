import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { prescriptionService } from './prescription.service';

const createPrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const result = await prescriptionService.createPrescription(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription created successfully!",
        data: result
    })
})

export const prescriptionController = {
    createPrescription
};