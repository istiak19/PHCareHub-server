export interface JwtUser {
    id: string;
    email: string;
    role: string;
};

export type FilterParams = Record<string, any>;