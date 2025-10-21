import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { patientService } from './patient.service';
import pick from '../../helpers/pick';
import { userFilterableFields } from '../user/user.constant';
import { JwtPayload } from 'jsonwebtoken';

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
    const patient = await patientService.getAllPatient(filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Patients retrieved successfully!",
        data: patient
    });
});

const getByPatient = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const patient = await patientService.getByPatient(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Patient retrieved successfully!",
        data: patient
    });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const patient = await patientService.createPatient(req);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Patient created successfully!",
        data: patient
    });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user as JwtPayload;
    const patient = await patientService.updatePatient(id, req.body, user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Patient update successfully!",
        data: patient
    });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const patient = await patientService.deletePatient(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Patient delete successfully!",
        data: patient
    });
});

export const patientController = {
    getAllPatient,
    getByPatient,
    createPatient,
    updatePatient,
    deletePatient
};