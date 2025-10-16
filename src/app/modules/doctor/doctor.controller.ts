import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorService } from './doctor.service';
import { doctorFilterableFields } from '../user/user.constant';
import pick from '../../helpers/pick';

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
    const doctor = await doctorService.getAllDoctor(filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctors retrieved successfully!",
        data: doctor
    });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const info = req.body;
    const doctor = await doctorService.updateDoctor(id, info);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor updated successfully!",
        data: doctor
    });
});

export const doctorController = {
    getAllDoctor,
    updateDoctor
};