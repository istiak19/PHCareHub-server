import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

export const handlePrismaValidationError = (err: Prisma.PrismaClientValidationError) => {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = "Invalid data or query structure. Please check your Prisma query and input values.";

    const errorMessages = [
        {
            path: "",
            message: err.message || "Prisma validation error occurred.",
        },
    ];

    const meta = {
        hint: "Verify your model fields and query syntax in the Prisma schema.",
    };

    return {
        success: false,
        statusCode,
        message,
        errorMessages,
        meta,
    };
};