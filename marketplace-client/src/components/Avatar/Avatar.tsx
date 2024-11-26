import Image from 'next/image';
import styles from './Avatar.module.css';
import alternativeIcon from './Img/user.png';
import { useEffect, useState } from 'react';

export type AvatarProps = {
    avatarClassName?: string,
    size?: number,
    url?: string;
}

export default function Avatar({
    avatarClassName='',
    size=40,
    url,
}: AvatarProps) {
    const [image, setImage] = useState<string>(url || alternativeIcon.src);

    useEffect(() => {
        setImage(url || alternativeIcon.src);
    }, [url]);

    return(
        <Image
            src={image}
            alt="avatar icon"
            width={size}
            height={size}
            className={avatarClassName}
            onError={() => {
                setImage(alternativeIcon.src);
            }}
        />
    );
}