import { AxiosResponse } from "axios";
import { axiosWithAuth } from "..";
import { INotice } from "@/types/notification/INotice";

export default class NotificationService {
    static getNotices(): Promise<AxiosResponse<INotice[]>> {
        return new Promise((resolve, reject) => {
            axiosWithAuth.get('user/notices')
              .then(response => resolve(response))
              .catch(error => reject(error));
        });
    }
}