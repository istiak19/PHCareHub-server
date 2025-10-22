import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentService } from './appointment.service';
import { JwtPayload } from 'jsonwebtoken';
import pick from '../../helpers/pick';

const createAppointment = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const appointmentInfo = req.body;
    const appointment = await appointmentService.createAppointment(decodedToken, appointmentInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Appointment created successfully!",
        data: appointment
    });
});

const getAllAppointment = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["paymentStatus", "status", "patientEmail", "doctorEmail"]) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
    const decodedToken = req.user as JwtPayload;
    const doctor = await appointmentService.getAllAppointment(decodedToken, filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Appointments retrieved successfully!",
        data: doctor
    });
});

const getMyAppointment = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["paymentStatus", "status"]) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
    const decodedToken = req.user as JwtPayload;
    const doctor = await appointmentService.getMyAppointment(decodedToken, filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Appointment retrieved successfully!",
        data: doctor
    });
});

const updateStatusAppointment = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const decodedToken = req.user as JwtPayload;
    const info = req.body;
    const appointment = await appointmentService.updateStatusAppointment(decodedToken, id, info);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Appointment updated successfully!",
        data: appointment
    });
});

// const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const doctor = await doctorService.deleteDoctor(id);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Doctor delete successfully!",
//         data: doctor
//     });
// });

export const appointmentController = {
    createAppointment,
    getMyAppointment,
    getAllAppointment,
    updateStatusAppointment
};