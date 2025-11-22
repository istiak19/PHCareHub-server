import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { prisma } from "../../shared/prisma";
import { Prisma } from '@prisma/client';
import { doctorSearchableFields } from '../user/user.constant';
import { FilterParams } from '../../../constants';
import calculatePagination, { IOptions } from '../../helpers/paginationHelper';
import { openai } from '../../helpers/openRouter';
import { extractJsonFromMessage } from '../../helpers/extractJsonFromMessage';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import { IDoctorUpdate } from './doctor.interface';

const getAllDoctor = async (params: FilterParams, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)
    const { searchTerm, specialties, ...filterData } = params;

    const andConditions: Prisma.DoctorWhereInput[] = [];
    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    };

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
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

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.doctor.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            Review: {
                select: {
                    rating: true,
                    comment: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result
    };
};

const getByDoctor = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            Review: true
        },
    });

    return doctor;
};

const updateDoctor = async (id: string, payload: Partial<IDoctorUpdate>) => {
    const { specialties, removeSpecialties, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });

    await prisma.$transaction(async (transactionClient) => {
        // Step 1: Update doctor basic data
        if (Object.keys(doctorData).length > 0) {
            await transactionClient.doctor.update({
                where: {
                    id,
                },
                data: doctorData,
            });
        }

        // Step 2: Remove specialties if provided
        if (
            removeSpecialties &&
            Array.isArray(removeSpecialties) &&
            removeSpecialties.length > 0
        ) {
            // Validate that specialties to remove exist for this doctor
            const existingDoctorSpecialties =
                await transactionClient.doctorSpecialties.findMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: {
                            in: removeSpecialties,
                        },
                    },
                });

            if (existingDoctorSpecialties.length !== removeSpecialties.length) {
                const foundIds = existingDoctorSpecialties.map(
                    (ds) => ds.specialitiesId
                );
                const notFound = removeSpecialties.filter(
                    (id) => !foundIds.includes(id)
                );
                throw new Error(
                    `Cannot remove non-existent specialties: ${notFound.join(", ")}`
                );
            }

            // Delete the specialties
            await transactionClient.doctorSpecialties.deleteMany({
                where: {
                    doctorId: doctorInfo.id,
                    specialitiesId: {
                        in: removeSpecialties,
                    },
                },
            });
        }

        // Step 3: Add new specialties if provided
        if (specialties && Array.isArray(specialties) && specialties.length > 0) {
            // Verify all specialties exist in Specialties table
            const existingSpecialties = await transactionClient.specialties.findMany({
                where: {
                    id: {
                        in: specialties,
                    },
                },
                select: {
                    id: true,
                },
            });

            const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
            const invalidSpecialties = specialties.filter(
                (id) => !existingSpecialtyIds.includes(id)
            );

            if (invalidSpecialties.length > 0) {
                throw new Error(
                    `Invalid specialty IDs: ${invalidSpecialties.join(", ")}`
                );
            }

            // Check for duplicates - don't add specialties that already exist
            const currentDoctorSpecialties =
                await transactionClient.doctorSpecialties.findMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: {
                            in: specialties,
                        },
                    },
                    select: {
                        specialitiesId: true,
                    },
                });

            const currentSpecialtyIds = currentDoctorSpecialties.map(
                (ds) => ds.specialitiesId
            );
            const newSpecialties = specialties.filter(
                (id) => !currentSpecialtyIds.includes(id)
            );

            // Only create new specialties that don't already exist
            if (newSpecialties.length > 0) {
                const doctorSpecialtiesData = newSpecialties.map((specialtyId) => ({
                    doctorId: doctorInfo.id,
                    specialitiesId: specialtyId,
                }));

                await transactionClient.doctorSpecialties.createMany({
                    data: doctorSpecialtiesData,
                });
            }
        }
    });

    // Step 4: Return updated doctor with specialties
    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
        },
    });

    return result;
};

const updateDoctorProfile = async (token: JwtPayload, id: string, req: Request) => {
    const isExistDoctor = await prisma.doctor.findUnique({
        where: {
            email: token.email,
            isDeleted: false
        }
    });

    if (!isExistDoctor) {
        throw new AppError(httpStatus.BAD_REQUEST, "Doctor not found");
    };

    let parsedData: any = {};
    if (req.body.data) {
        parsedData = JSON.parse(req.body.data);
    };

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        parsedData.profilePhoto = uploadResult?.secure_url
    };

    const result = await prisma.doctor.update({
        where: { id },
        data: parsedData
    });

    return result;
};

const deleteDoctor = async (id: string) => {
    const doctor = await prisma.doctor.delete({
        where: {
            id,
            isDeleted: false
        }
    });

    return doctor;
};

const getAISuggestions = async (payload: { symptoms: string }) => {
    if (!(payload)) {
        throw new AppError(httpStatus.BAD_REQUEST, "symptoms is required!")
    };

    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    console.log("doctors data loaded.......\n");
    const prompt = `You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors. Each doctor has specialties and years of experience. Only suggest doctors who are relevant to the given symptoms.
    Symptoms: ${payload.symptoms}
    Here is the doctor list (in JSON): ${JSON.stringify(doctors, null, 2)}

    Return your response in JSON format with full individual doctor data. `;

    console.log("analyzing......\n")
    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content: "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    // console.log(completion.choices[0].message);
    const result = await extractJsonFromMessage(completion.choices[0].message)
    return result;
};

export const doctorService = {
    getAllDoctor,
    getByDoctor,
    updateDoctor,
    deleteDoctor,
    updateDoctorProfile,
    getAISuggestions
};