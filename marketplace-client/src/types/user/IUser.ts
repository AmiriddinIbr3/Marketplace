import { EnumUserRole } from "./EnumUserRole";

export interface IUser {
    id: number;
    email: string;
    username: string;
    name: string;
    surname: string;
    isActivated: boolean;
    role: EnumUserRole;
}