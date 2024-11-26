import { axiosWithAuth } from "@/services/RestAPI";
import { AxiosResponse } from "axios";

export default class UserService {
    static getAvatarsIds(): Promise<AxiosResponse<string[]>> {
        return new Promise((resolve, reject) => {
            axiosWithAuth.get(`user/avatar`)
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
}