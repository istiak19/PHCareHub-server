import { role } from './../../../constants/roles';
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from 'uuid';
import { stripe } from "../../helpers/stripe";
import calculatePagination, { IOptions } from "../../helpers/paginationHelper";
import { FilterParams } from "../../../constants";
import { Prisma } from "@prisma/client";

const createAppointment = async (token: JwtPayload, payload: { doctorId: string, scheduleId: string }) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: token.email
        }
    });

    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });

    await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBook: false
        }
    });

    const videoCallId = uuidv4();

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctor.id,
                scheduleId: payload.scheduleId,
                videoCallingId: videoCallId
            }
        });

        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctor.id,
                    scheduleId: payload.scheduleId,
                }
            },
            data: {
                isBook: true
            }
        });

        const transactionId = uuidv4();

        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                transactionId,
                amount: doctor.appointmentFee
            }
        });

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: token.email,
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Doctor: ${doctor.name}`,
                        },
                        unit_amount: doctor.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id
            },
        });

        return { paymentUrl: session.url };
    });

    return result;
};

const getMyAppointment = async (token: JwtPayload, params: FilterParams, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { ...filterData } = params;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (token.role === role.patient) {
        andConditions.push({
            patient: {
                email: token.email
            }
        })
    } else {
        andConditions.push({
            doctor: {
                email: token.email
            }
        })
    };

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.appointment.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: token.role === role.doctor ? { patient: true } : { doctor: true }
    });

    const total = await prisma.appointment.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result
    };
};

export const appointmentService = {
    createAppointment,
    getMyAppointment
};