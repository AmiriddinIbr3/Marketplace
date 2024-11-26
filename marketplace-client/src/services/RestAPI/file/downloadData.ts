import { axiosWithAuth } from "@/services/RestAPI";
import { BehaviorSubject } from "rxjs";

export class DownloadData {
    public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    public async download(endpoint: string, id: string): Promise<string | ArrayBuffer | null> {
        return axiosWithAuth.get(
            `${endpoint}/${id}`,
            {
                responseType: 'arraybuffer',
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        this.downloadProgress.next(progress);
                    }
                },
            }
        )
        .then(response => {
            const contentType = response.headers['content-type'];
            if (contentType && contentType.startsWith('image/')) {
                const blob = new Blob([response.data], { type: contentType });
                const imageUrl = URL.createObjectURL(blob);

                return imageUrl;
            }

            return response.data;
        })
        .catch(error => {
            console.log(error)

            return null;
        });
    }

    resetProgress(){
        this.downloadProgress.next(0);
    }
}