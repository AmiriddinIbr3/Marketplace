import { axiosWithAuth } from "@/services/RestAPI";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { BehaviorSubject } from "rxjs";
import axios, { CancelTokenSource } from 'axios';

export class UploadData<T extends FieldValues> {
    private setError: UseFormSetError<T>;
    private cancelTokenSource: CancelTokenSource;
    private formData: FormData;
    public uploadProgress: BehaviorSubject<number>;

    constructor(setError: UseFormSetError<T>) {
        this.setError = setError;
        this.cancelTokenSource = axios.CancelToken.source();
        this.formData = new FormData();
        this.uploadProgress = new BehaviorSubject<number>(0);
    }

    public append(fieldName: string, data: string | File | FileList): void {
        if (data instanceof FileList) {
            Array.from(data).forEach((file) => {
                this.formData.append(fieldName, file, file.name);
            });
        }
        else if (data instanceof File) {
            this.formData.append(fieldName, data, data.name);
        }
        else if (data !== null && data !== undefined) {
            this.formData.append(fieldName, data);
        }
    }

    public upload(endpoint: string) {
        this.cancelTokenSource = axios.CancelToken.source();

        axiosWithAuth
            .post(endpoint, this.formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'arraybuffer',
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        this.uploadProgress.next(progress);
                    }
                },
                cancelToken: this.cancelTokenSource.token,
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                }
                else {
                    const { response } = error;
                    const errors = response.data.errors;

                    if (!response || !response.data || !errors) return;

                    // Object.keys(errors).forEach((key) => {
                    //     if (key in this.setError) {
                    //         this.setError(key as Path<T>, {
                    //             type: 'manual',
                    //             message: 'Error during sending',
                    //         });
                    //     }
                    // });
                }
            })
            .finally(() => {
                this.formData = new FormData();
            });
    }

    public cancelRequest() {
        this.cancelTokenSource.cancel('Cancel by User');
        this.formData = new FormData();
        this.uploadProgress.next(0);
    }

    private resetProgress() {
        this.uploadProgress.next(0);
    }
}