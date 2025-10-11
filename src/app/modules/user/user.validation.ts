import z from "zod";

const createPatientValidation = z.object({
    password: z.string(),
    patient: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        address: z.string().optional()
    })
});

export const UserValidation = {
    createPatientValidation
};