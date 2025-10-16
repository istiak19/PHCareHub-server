import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { handleZodError } from "../errors/handleZodError";
import { handlePrismaError } from "../errors/handlePrismaError";
import { handleGenericError } from "../errors/handleGenericError";
import { handlePrismaValidationError } from "../errors/handlePrismaValidationError";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorMessages: { path: string | number; message: string }[] = [];
    let meta: Record<string, unknown> | undefined;

    if (err instanceof ZodError) {
        ({ statusCode, message, errorMessages } = handleZodError(err));
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = handlePrismaError(err);
        statusCode = prismaError.statusCode;
        message = prismaError.message;
        errorMessages = prismaError.errorMessages;
        meta = prismaError.meta;
    }
    else if (err instanceof Prisma.PrismaClientValidationError) {
        ({ statusCode, message, errorMessages, meta } =
            handlePrismaValidationError(err));
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessages = [{ path: "", message: err.message }];
    }
    else if (err instanceof Error) {
        ({ statusCode, message, errorMessages } = handleGenericError(err));
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        ...(meta && { meta }),
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default globalErrorHandler;