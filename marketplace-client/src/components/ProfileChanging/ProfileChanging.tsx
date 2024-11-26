"use client";
import Image from 'next/image';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import Modal from '../Modal/Modal';
import styles from './ProfileChanging.module.css';
import { IAvatar } from '@/types/forms/IAvatar';
import { UploadData } from '@/services/RestAPI/file/uploadData';
import cameraIcon from './Img/camera.png';
import { imageProto } from '../Forms/InputProtos';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import { useEffect } from 'react';

export type ProfileChangingProps = {
    className?: string,
    size?: number,
}

export default function ProfileChanging({
    className='',
    size=40,
}: ProfileChangingProps) {
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        reset,
        formState
    } = useForm<IAvatar>({
        mode: "onChange",
    });

    const uploadingData = new UploadData<IAvatar>(setError);

    const submit: SubmitHandler<IAvatar> = async (data) => {
        const { avatar } = data;

        if (avatar) {
            clearErrors('avatar');

            uploadingData.append('avatar', avatar);

            uploadingData.uploadProgress.subscribe((progress) => {
                console.log(progress);
            });

            uploadingData.upload('user/avatar');
            reset();
        }
        else {
            setError('avatar', {
                type: 'manual',
                message: 'Avatar is empty'
            });
        }
    }

    const error: SubmitErrorHandler<IAvatar> = error => {
        console.log(error);
    }

    const avatarError = formState.errors.avatar?.message;

    return(
        <Modal
            contentClassName={`${styles.changeProfile} flex-col items-center flex`}
            minwidthToUnbox={500}
            cantClose={false}
            fixed={false}
        >
            <form
                className={className}
                onSubmit={handleSubmit(submit, error)}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }}
            >
                <label
                    htmlFor="avatar"
                    className={styles.avatar}
                >
                    <ProfileAvatar
                        className={`${styles.profileAvatar}
                        rounded-full`}
                    />
                    <div className={styles.wrapper}>
                        <Image
                            src={cameraIcon}
                            alt="camera icon"
                            width={size - 20}
                            height={size - 20}
                            className={styles.cameraIcon}
                        />
                    </div>
                </label>
                <input
                    id="avatar"
                    type="file"
                    accept=".png,.jpeg"
                    {...register('avatar', {
                        ...imageProto,
                        required: true,
                    })}
                />
            </form>
            <button
                type="button"
                onClick={() => handleSubmit(submit, error)()}
            >
                Submit
            </button>
        </Modal>
    );
}