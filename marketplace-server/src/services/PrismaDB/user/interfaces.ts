import { UserRole } from "@prisma/client";

export interface ICreateUserDB {
    name: string;
    surname?: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    countryCode: string;
    ip: string;
    role: UserRole;
}