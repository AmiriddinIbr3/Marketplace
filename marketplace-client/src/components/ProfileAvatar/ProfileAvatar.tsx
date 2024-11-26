"use client";
import { useEffect, useState } from 'react';
import { DownloadData } from '@/services/RestAPI/file/downloadData';
import UserService from '@/services/RestAPI/requests/userService';
import Avatar from '../Avatar/Avatar';

export type ProfileAvatarProps = {
    className?: string,
    size?: number,
}

export default function ProfileAvatar({
    className='',
    size=40,
}: ProfileAvatarProps) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [imageProgress, setImageProgress] = useState<number>(0);

    useEffect(() => {
        const imageDownloading = new DownloadData();
        const subscription = imageDownloading.downloadProgress.subscribe(setImageProgress);

        const fetchImage = () => {
            UserService.getAvatarsIds()
                .then(response => {
                    const imagesIds = response.data;
                    
                    if (imagesIds.length !== 0) {
                        imageDownloading.download('download/imageStream', imagesIds[0])
                            .then(imageUrl => {
                                if (
                                    imageUrl && 
                                    typeof imageUrl === "string"
                                ) {
                                    setImageUrl(imageUrl);
                                }
                            });
                    }
                });
        }

        fetchImage();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return(
        <Avatar
            size={size}
            avatarClassName={className}
            url={imageUrl}
        />
    );
}