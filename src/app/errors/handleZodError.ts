import { ZodError } from "zod";
import httpStatus from "http-status";

export const handleZodError = (err: ZodError) => {
    const errors = err.issues.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
    }));

    return {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation Error",
        errorMessages: errors,
    };
};