"use client";
import { getAccessToken, saveAccessToken } from "@/helpers/tokenHelper";
import AuthService from "@/services/RestAPI/requests/authService";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user/IUser";

import { store } from "@/redux";
import { setUser } from "@/redux/userSlice";

export default function useCheckAuth() {
    const [data, setData] = useState<IUser | undefined>(undefined);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (getAccessToken()) {
            AuthService.checkAccessToken()
                .then(response => {
                    setData(response.data);
                    store.dispatch(setUser(response.data));
                })
                .catch(error => {
                    setData(undefined);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        else {
            AuthService.refresh()
                .then(response => {
                    saveAccessToken(response.data.accessToken);
                    store.dispatch(setUser(response.data.user));
                })
                .catch(error => {
                    setData(undefined);
                    setLoading(false);
                });
        }
    }, []);

    return { isLoading, data }
}