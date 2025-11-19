import { Gender } from "@prisma/client";
import z from "zod";

const createPatientValidation = z.object({
    password: z.string().nonempty("Password is required"),
    patient: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        address: z.string().optional()
    })
});

const createAdminValidation = z.object({
    password: z.string().nonempty("Password is required"),
    admin: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        contactNumber: z.string().nonempty("Contact Number is required"),
    }),
});

const createDoctorValidation = z.object({
    password: z.string({
        error: "Password is required",
    }),
    doctor: z.object({
        name: z.string({
            error: "Name is required!",
        }),
        email: z.string({
            error: "Email is required!",
        }),
        contactNumber: z.string({
            error: "Contact Number is required!",
        }),
        address: z.string().optional(),
        registrationNumber: z.string({
            error: "Reg number is required",
        }),
        experience: z.number().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number({
            error: "Appointment fee is required",
        }),
        qualification: z.string({
            error: "Qualification is required",
        }),
        currentWorkingPlace: z.string({
            error: "Current working place is required!",
        }),
        designation: z.string({
            error: "Designation is required!",
        }),
        // NEW: Add specialties array for doctor creation
        specialties: z
            .array(
                z.string().uuid({
                    message: "Each specialty must be a valid UUID",
                })
            )
            .min(1, {
                message: "At least one specialty is required",
            })
            .optional(),
    }),
});

export const UserValidation = {
    createPatientValidation,
    createAdminValidation,
    createDoctorValidation
};