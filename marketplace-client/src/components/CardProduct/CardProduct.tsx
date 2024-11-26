"use client";
import { ImageInterface } from '@/types/product/IProduct';
import styles from './CardProduct.module.css';
import { useEffect, useState, useCallback } from 'react';
import { DownloadData } from '@/services/RestAPI/file/downloadData';
import LikeIcon from './Img/like.png';
import Image from 'next/image';
import ProductService from '@/services/RestAPI/requests/productService';

export type CardProductProps = {
    id: string;
    price: number;
    description: string;
    title: string;
    likes: number;
    mainImageId: string;
    imagesIds: ImageInterface[];
};

export default function CardProduct({
    id,
    price,
    description,
    title,
    likes,
    mainImageId,
    imagesIds,
}: CardProductProps) {
    const [mainImageProgress, setMainImageProgress] = useState<number>(0);
    const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
    const [likesCount, setLikesCount] = useState<number>(likes);

    const updateLikesCount = useCallback(() => {
        ProductService.getLikesCount(id)
            .then((response) => {
                setLikesCount(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        ProductService.likeProduct(id)
            .then((response) => {
                updateLikesCount();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        const mainImage = new DownloadData();
        const subscription = mainImage.downloadProgress.subscribe(setMainImageProgress);

        const fetchImage = async () => {
            const imageUrl = await mainImage.download('download/imageStream', mainImageId);
            if (imageUrl && typeof imageUrl === 'string') {
                setMainImageUrl(imageUrl);
            }
        };

        updateLikesCount();
        fetchImage();

        return () => {
            subscription.unsubscribe();
        };
    }, [mainImageId, id, updateLikesCount]);

    return (
        <div className={styles.card}>
            <div className={styles.mainImageContainer}>
                {mainImageUrl && (
                    <Image
                        src={mainImageUrl}
                        alt="Product main image"
                        width={200}
                        height={100}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                )}
                <button
                    type="button"
                    className={styles.likeBtn}
                    onClick={handleLike}
                >
                    <p className={styles.likes}>{likesCount}</p>
                    <Image
                        src={LikeIcon}
                        alt="like icon"
                        width={20}
                        height={20}
                        className="ml-1 mb-1"
                    />
                </button>
            </div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.price}>{price}</p>
            <p className={styles.description}>{description}</p>
        </div>
    );
}