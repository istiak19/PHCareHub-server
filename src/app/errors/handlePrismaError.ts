import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
    let message = "Database error occurred";
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;

    if (err.code === "P2002") {
        message = "Duplicate field value violates unique constraint";
        statusCode = httpStatus.CONFLICT;
    } else if (err.code === "P2025") {
        message = "Record not found in database";
        statusCode = httpStatus.NOT_FOUND;
    }

    return {
        statusCode,
        message,
        errorMessages: [{ path: "", message: err.message }],
    };
};