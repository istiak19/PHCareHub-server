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
    password: z.string().nonempty("Password is required"),
    doctor: z.object({
        name: z.string().nonempty("Name is required"),
        email: z
            .string()
            .email("Invalid email format")
            .nonempty("Email is required"),
        contactNumber: z.string().nonempty("Contact number is required"),
        address: z.string().optional(),
        registrationNumber: z.string().nonempty("Registration number is required"),

        // Convert strings to numbers and validate
        experience: z
            .preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
        appointmentFee: z.preprocess(
            (val) => (val ? Number(val) : undefined),
            z.number().refine((val) => val !== undefined, {
                message: "Appointment fee is required",
            })
        ),

        gender: z.enum([Gender.MALE, Gender.FEMALE]).refine(
            (val) => !!val,
            { message: "Gender is required" }
        ),

        qualification: z.string().nonempty("Qualification is required"),
        currentWorkingPlace: z.string().nonempty("Current working place is required"),
        designation: z.string().nonempty("Designation is required"),
    }),
});

export const UserValidation = {
    createPatientValidation,
    createAdminValidation,
    createDoctorValidation
};