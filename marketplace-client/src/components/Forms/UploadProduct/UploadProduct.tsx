"use client";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { IProduct } from "@/types/forms/IProduct";
import styles from "./UploadProduct.module.css";
import ErrorWrapper from "../ErrorWrapper/ErrorWrapper";
import BtnsColour from "@/components/BtnsColour/BtnsColour";
import { descriptionProto, imageProto, priceProto, titleProto } from "../InputProtos";
import { UploadData } from "@/services/RestAPI/file/uploadData";
import Modal from "@/components/Modal/Modal";

export default function UploadProduct() {
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        reset,
        formState
    } = useForm<IProduct>({
        mode: "onChange",
    });

    const submit: SubmitHandler<IProduct> = data => {
        const { images, price, title, description, mainImage } = data;
        
        if(Number.isNaN(price)) {
            setError('price', {
                type: 'manual',
                message: 'The field must contain number'
            });
            return;
        }

        const uploadingData = new UploadData<IProduct>(setError);

        uploadingData.append('title', title);
        uploadingData.append('price', price.toString());
        uploadingData.append('description', description || '');
        uploadingData.append('images', images);
        if(mainImage) {
            uploadingData.append('mainImage', mainImage);
        }

        uploadingData.uploadProgress.subscribe((progress) => {
            console.log(progress);
        });
        
        uploadingData.upload('product');
    }

    const error: SubmitErrorHandler<IProduct> = error => {
        console.log(error);
    }

    const titleError = formState.errors.title?.message;
    const priceError = formState.errors.price?.message;
    const descriptionError = formState.errors.description?.message;
    const imagesError = formState.errors.images?.message;
    const mainImageError = formState.errors.mainImage?.message;

    return(
        <Modal
            contentClassName='flex-col items-center flex'
            minwidthToUnbox={500}
            cantClose={false}
            fixed={false}
        >
            <form className={styles.productForm} onSubmit={handleSubmit(submit, error)}>
                <ErrorWrapper errorMessage={imagesError}>
                    <label htmlFor="images" className="custom-file-upload">
                        Select images
                    </label>
                    <input id="images" type="file" accept=".png,.jpeg" {...register('images', imageProto)}/>
                </ErrorWrapper>

                <ErrorWrapper errorMessage={mainImageError}>
                    <label htmlFor="mainImage" className="custom-file-upload">
                        Select main image
                    </label>
                    <input id="mainImage" type="file" accept=".png,.jpeg" {...register('mainImage', imageProto)}/>
                </ErrorWrapper>

                <ErrorWrapper errorMessage={titleError}>
                    <input
                        type="text"
                        placeholder="Enter title"
                        {...register('title', titleProto)}
                    />
                </ErrorWrapper>

                <ErrorWrapper errorMessage={priceError}>
                    <input
                        type="text"
                        placeholder="Enter price"
                        {...register('price', priceProto)}
                    />
                </ErrorWrapper>

                <ErrorWrapper errorMessage={descriptionError}>
                    <input
                        type="text"
                        placeholder="Enter description"
                        {...register('description', descriptionProto)}
                    />
                </ErrorWrapper>
                
                <BtnsColour className="btns-wrapper">
                    <button type="submit">Send form</button>
                    <button type="button" onClick={() => {
                        clearErrors()
                        reset()
                    }}>
                        Reset form
                    </button>
                </BtnsColour>
            </form>
        </Modal>
    );
}