"use client";
import styles from './DropDown.module.css';
import { useEffect, useState } from 'react';

export type DropDownProps = {
    active: boolean,
    className?: string,
    children: Readonly<React.ReactNode>,
}

export default function DropDown({
    active,
    className = '',
    children,
}: DropDownProps) {
    const [isActive, setActive] = useState(active);

    useEffect(() => {
        setActive(active);
    }, [active]);

    return (
        <div className={`${className} ${styles.userPanel} ${isActive ? styles.opened : ''}`}>
            {children}
        </div>
    );
}