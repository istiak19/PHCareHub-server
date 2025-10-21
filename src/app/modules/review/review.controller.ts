import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { reviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const result = await reviewService.createReview(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully!",
        data: result
    });
});

export const reviewController = {
    createReview
};