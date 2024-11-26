"use client";
import { removeAccessToken } from "@/helpers/tokenHelper";
import { store } from "@/redux";
import { logoutUser } from "@/redux/userSlice";
import AuthService from "@/services/RestAPI/requests/authService";
import { AxiosError } from "axios";

export default function Logout() {
    return(
        <button
            type="button"
            onClick={() => {
                AuthService.logout()
                    .then(() => {
                        removeAccessToken();
                        store.dispatch(logoutUser());
                    })
                    .catch(err => {
                        if (err instanceof AxiosError && err.response) {
                            const serverErrors = err.response.data;
                            console.log(serverErrors);
                        }
                    });
            }
        }>
            Logout
        </button>
    );
}