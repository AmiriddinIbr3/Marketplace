"use client";
import React, { useEffect, useState } from 'react';
import styles from "./Modal.module.css";
import Image from 'next/image';
import closeIcon from './Img/close.png';
import useWindowWidth from '@/hooks/useWindowWidth';

export type ModalProps = {
    children: React.ReactNode,
    active?: boolean,
    setActive?: React.Dispatch<React.SetStateAction<boolean>>,
    cantClose?: boolean,
    contentClassName?: string,
    minwidthToUnbox?: number,
    fixed?: boolean,
};

export default function Modal({
    children,
    active = true,
    setActive,
    cantClose = true,
    contentClassName = '',
    minwidthToUnbox,
    fixed = true
}: ModalProps) {
    const windowWidth = useWindowWidth();
    const [isUploaded, setUploaded] = useState<boolean>();
    
    useEffect(() => {
        setUploaded(true);
    }, [windowWidth]);

    if (!isUploaded) {
        return null;
    }

    if(!setActive) {
        if(!minwidthToUnbox || windowWidth >= minwidthToUnbox) {
            return(
                <>
                    {fixed? (
                        <div className={styles.container}>
                            <div className={`${styles.window__content} ${contentClassName}`}>
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div className={`${styles.window__content} ${contentClassName}`}>
                            {children}
                        </div>
                    )}
                </>
            );
        }
        else {
            return(
                <div className={`${fixed? styles.container : ''} ${styles.minwidth}`}>
                    {children}
                </div>
            );
        }
    }

    if(cantClose) {
        if(!minwidthToUnbox || windowWidth >= minwidthToUnbox) {
            return(
                <div className={`${fixed? styles.container : ''} ${styles.modal} ${active? styles.active : ""}`}>
                    <div className={`${styles.window__content} ${contentClassName}`}>
                        {children}
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className={`${fixed? styles.container : ''} ${styles.modal} ${styles.minwidth} ${active? styles.active : ""}`}>
                    {children}
                </div>
            );
        }
    }

    const handleClose = () => {
        setActive(false);
    };

    if(!minwidthToUnbox || windowWidth >= minwidthToUnbox) {
        return(
            <div className={`${fixed? styles.container : ''} ${styles.modal} ${active? styles.active : ""}`} onClick={handleClose}>
                <div className={`${styles.window__content} ${contentClassName}`} onClick={(e) => e.stopPropagation()}>
                    <Image
                        className={styles.modal__close}
                        onClick={handleClose}
                        src={closeIcon}
                        width={50}
                        height={50}
                        alt="Close"
                        priority
                    />
                    {children}
                </div>
            </div>
        );
    }
    else {
        return(
            <div className={`${fixed? styles.container : ''} ${styles.modal} ${styles.minwidth} ${active? styles.active : ""}`}>
                <Image
                    className={styles.modal__close}
                    onClick={handleClose}
                    src={closeIcon}
                    width={50}
                    height={50}
                    alt="Close"
                    priority
                />
                {children}
            </div>
        );
    }
}