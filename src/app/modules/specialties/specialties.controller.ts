import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.createSpecialties(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.getAllSpecialties();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialties retrieved successfully',
        data: result,
    });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteSpecialties(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});

export const SpecialtiesController = {
    createSpecialties,
    getAllSpecialties,
    deleteSpecialties
};