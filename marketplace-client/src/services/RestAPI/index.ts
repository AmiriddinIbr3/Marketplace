"use client";
import { getAccessToken, removeAccessToken, saveAccessToken } from "@/helpers/tokenHelper";
import axios, { AxiosError, AxiosResponse, CreateAxiosDefaults } from "axios";
import { IAuthResponse } from "@/types/responses/IAuthResponse";
import AuthService from "@/services/RestAPI/requests/authService";
import { setUser, logoutUser } from "@/redux/userSlice";
import { store } from "@/redux";
import iconv from 'iconv-lite';

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

const options: CreateAxiosDefaults = {
    baseURL: ApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
};

const classicAxios = axios.create(options);
const axiosWithAuth = axios.create(options);

axiosWithAuth.interceptors.request.use(config => {
    const accessToken = getAccessToken();

    if (config?.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
});

axiosWithAuth.interceptors.response.use(
    response => response,
    async error => {
        const { config, response } = error;

        if (error instanceof AxiosError) {
            if (
                response &&
                response.data instanceof ArrayBuffer
            ) {
                const buffer = Buffer.from(response.data);
                const decodedData = iconv.decode(buffer, 'utf-8');

                try {
                    response.data = JSON.parse(decodedData);
                }
                catch(error) {
                    console.log(error);
                }
            }

            if (
                config &&
                !config._isRetry
            ) {
                config._isRetry = true;

                if(response?.status === 401) {
                    try {
                        const refreshResponse: AxiosResponse<IAuthResponse> = await AuthService.refresh();
                        saveAccessToken(refreshResponse.data.accessToken);
                        store.dispatch(setUser(refreshResponse.data.user));
        
                        return axiosWithAuth.request(config);
                    } catch (err) {
                        removeAccessToken();
                        store.dispatch(logoutUser());
                    }
                }
            }
        }

        return Promise.reject(error.response.data);
    }
);

export { axiosWithAuth, classicAxios };