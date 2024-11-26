import { useEffect, useState } from 'react';
import styles from './DropDownNotifications.module.css';
import DropDown from '../DropDown/DropDown';

export type DropDownNotificationsProps = {
    active: boolean,
    children: Readonly<React.ReactNode>,
}

export default function DropDownNotifications({
    active,
    children,
}: DropDownNotificationsProps) {
    const [isActive, setActive] = useState(active);

    useEffect(() => {
        setActive(active);
    }, [active]);

    return (
        <DropDown
            className={`flex flex-col items-start ${styles.notificationsPanel}`}
            active={isActive}
        >
            {children}
        </DropDown>
    );
}