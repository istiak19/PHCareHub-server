import httpStatus from "http-status";

export const handleGenericError = (err: Error) => {
    return {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong!",
        errorMessages: [{ path: "", message: err.message }],
    };
};