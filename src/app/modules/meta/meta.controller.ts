import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../shared/sendResponse";
import { metaService } from './meta.service';



const fetchDashboardMetaData = catchAsync(async (req: Request, res: Response) => {

    const user = req.user as JwtPayload;
    const result = await metaService.fetchDashboardMetaData(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meta data retrieved successfully!",
        data: result
    })
});

export const metaController = {
    fetchDashboardMetaData
};