import { axiosWithAuth, classicAxios } from "@/services/RestAPI";
import { IAuthResponse } from "@/types/responses/IAuthResponse";
import { IUser } from "@/types/user/IUser";
import { AxiosResponse } from "axios";

export default class AuthService {
    static checkAccessToken(): Promise<AxiosResponse<IUser>> {
        return new Promise((resolve, reject) => {
            axiosWithAuth.get('user/checkAccessToken')
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    static login(password: string, email?: string, username?: string, phone?: string, countryCode?: string): Promise<AxiosResponse<IAuthResponse>> {
        return new Promise((resolve, reject) => {
            classicAxios.post('user/login', { password, email, username, phone, countryCode })
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    static registration(name: string, username: string, email: string, password: string, phone: string, phoneRegion: string, surname?: string): Promise<AxiosResponse<IAuthResponse>> {
        return new Promise((resolve, reject) => {
            classicAxios.post('user/registration', { name, username, email, password, surname, phone, phoneRegion })
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    static logout(): Promise<AxiosResponse<void>> {
        return new Promise((resolve, reject) => {
            axiosWithAuth.post('user/logout')
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    static refresh(): Promise<AxiosResponse<IAuthResponse>> {
        return new Promise((resolve, reject) => {
            classicAxios.get('user/refresh')
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
}