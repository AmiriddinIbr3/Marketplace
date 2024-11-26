import { IUser } from "../user/IUser";

export interface IAuthResponse {
    accessToken: string;
    user: IUser;
}