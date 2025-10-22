import { role } from "./roles";

export type FilterParams = Record<string, any>;

export interface JwtUser {
    id: string;
    email: string;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
};