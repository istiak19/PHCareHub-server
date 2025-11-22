export type FilterParams = Record<string, any>;

export interface JwtUser {
    name: string;
    id: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
};