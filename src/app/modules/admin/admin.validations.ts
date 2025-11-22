import { z } from "zod";

const update = z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional()
});

export const adminValidationSchemas = {
    update
};