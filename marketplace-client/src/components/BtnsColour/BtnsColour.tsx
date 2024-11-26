"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './BtnsColour.module.css';

export type BtnsColourProps = {
    children: React.ReactNode,
    className?: string,
}

export default function BtnsColour({
    children,
    className = ''
}: BtnsColourProps) {
    const container = useRef<HTMLDivElement | null>(null);
    const [buttonClass, setButtonClass] = useState<string>('');

    useEffect(() => {
        if (container.current) {
            const count = container.current.children.length;
            const newClass =
                count === 1 ? styles.soloBtns :
                count === 2 ? styles.duoBtns :
                count >= 3 ? styles.trioBtns :
                '';
            setButtonClass(newClass);
        }
    }, [children]);

    return (
        <div className={`${buttonClass} ${className}`} ref={container}>
            {children}
        </div>
    );
}