export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export enum BloodGroup {
    A_POSITIVE = "A_POSITIVE",
    A_NEGATIVE = "A_NEGATIVE",
    B_POSITIVE = "B_POSITIVE",
    B_NEGATIVE = "B_NEGATIVE",
    AB_POSITIVE = "AB_POSITIVE",
    AB_NEGATIVE = "AB_NEGATIVE",
    O_POSITIVE = "O_POSITIVE",
    O_NEGATIVE = "O_NEGATIVE",
}

export enum MaritalStatus {
    MARRIED = "MARRIED",
    UNMARRIED = "UNMARRIED"
}

export interface IPatientHealthData {
    gender: Gender;
    dateOfBirth: string;
    bloodGroup: BloodGroup;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height: string;
    weight: string;
    smokingStatus?: boolean;
    dietaryPreferences?: string;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string;
    immunizationStatus?: string;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus: MaritalStatus;
}

export interface IMedicalReport {
    reportName: string;
    reportLink: string;
}

export interface IPatient {
    name: string;
    email?: string;
    profilePhoto?: string;
    address?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    medicalReport?: IMedicalReport[];
    patientHealthData?: IPatientHealthData;
}