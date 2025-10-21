import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { AppError } from "../../errors/AppError";
import { IReview } from './review.interface';

const createReview = async (token: JwtPayload, payload: IReview) => {
    const isExistPatient = await prisma.patient.findUnique({
        where: {
            email: token.email
        }
    });

    if (!isExistPatient) {
        throw new AppError(httpStatus.BAD_REQUEST, "Patient not found");
    };

    const isExistAppointment = await prisma.appointment.findUnique({
        where: {
            id: payload.appointmentId
        }
    });

    if (isExistAppointment?.patientId !== isExistPatient.id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Appointment not found");
    };

    const reviewData = await prisma.$transaction(async (tnx) => {
        const result = await tnx.review.create({
            data: {
                appointmentId: payload.appointmentId,
                comment: payload.comment,
                rating: payload.rating,
                doctorId: isExistAppointment.doctorId,
                patientId: isExistPatient.id
            }
        });

        const avgRating = await tnx.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                doctorId: isExistAppointment.doctorId
            }
        });

        await tnx.doctor.update({
            where: {
                id: isExistAppointment.doctorId
            },
            data: {
                averageRating: avgRating._avg.rating as number
            }
        });

        return result;
    });

    return reviewData;
};

export const reviewService = {
    createReview
};