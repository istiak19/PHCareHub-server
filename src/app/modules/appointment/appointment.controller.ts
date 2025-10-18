import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentService } from './appointment.service';
import { JwtPayload } from 'jsonwebtoken';

const createAppointment = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const appointmentInfo = req.body;
    const appointment = await appointmentService.createAppointment(decodedToken, appointmentInfo);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Appointment created successfully!",
        data: appointment
    });
});

// const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
//     const filters = pick(req.query, doctorFilterableFields) // searching , filtering
//     const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
//     const doctor = await doctorService.getAllDoctor(filters, options);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Doctors retrieved successfully!",
//         data: doctor
//     });
// });

// const getByDoctor = catchAsync(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const doctor = await doctorService.getByDoctor(id);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Doctor retrieved successfully!",
//         data: doctor
//     });
// });

// const updateDoctor = catchAsync(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const info = req.body;
//     const doctor = await doctorService.updateDoctor(id, info);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Doctor updated successfully!",
//         data: doctor
//     });
// });

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
    createAppointment
};