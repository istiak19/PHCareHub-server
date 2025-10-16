import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
    let message = "An unexpected database error occurred.";
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let meta: Record<string, unknown> = {};

    switch (err.code) {
        case "P2002":
            message = "A record with the same value already exists. Please use a unique value.";
            statusCode = httpStatus.CONFLICT;
            meta = err.meta ?? { target: "Unknown unique field" };
            break;

        case "P2025":
            message = "The requested record could not be found in the database.";
            statusCode = httpStatus.NOT_FOUND;
            meta = err.meta ?? { cause: "Record not found" };
            break;

        case "P2003":
            message = "Operation failed due to a foreign key constraint violation.";
            statusCode = httpStatus.BAD_REQUEST;
            meta = err.meta ?? { cause: "Foreign key constraint failed" };
            break;

        case "P2014":
            message = "Invalid relation reference. Please verify the linked records.";
            statusCode = httpStatus.BAD_REQUEST;
            meta = err.meta ?? { cause: "Invalid relation" };
            break;

        case "P2016":
            message = "Query returned invalid data. Please check your request parameters.";
            statusCode = httpStatus.BAD_REQUEST;
            meta = err.meta ?? { cause: "Invalid query result" };
            break;

        case "P2018":
            message = "Required related records were not found.";
            statusCode = httpStatus.BAD_REQUEST;
            meta = err.meta ?? { cause: "Missing related records" };
            break;

        case "P2019":
            message = "Input value is invalid for this operation.";
            statusCode = httpStatus.BAD_REQUEST;
            meta = err.meta ?? { cause: "Invalid input" };
            break;

        default:
            message = "A database operation failed. Please try again or contact support if the issue persists.";
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            meta = err.meta ?? { cause: "Unknown Prisma error" };
    }

    return {
        success: false,
        statusCode,
        message,
        errorMessages: [
            {
                path: "",
                message: err.message || "Prisma client encountered an unexpected error.",
            },
        ],
        meta,
    };
};