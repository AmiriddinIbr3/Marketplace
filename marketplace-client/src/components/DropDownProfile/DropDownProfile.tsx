import styles from './DropDownProfile.module.css';

import Logout from '../Forms/Logout/Logout';
import DropDown from '../DropDown/DropDown';
import useWindowWidth from '@/hooks/useWindowWidth';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';

import { useAppSelector } from '@/redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type DropDownProfileProps = {
    active: boolean,
    minwidthToUnbox?: number,
}

export default function DropDownProfile({
    active,
    minwidthToUnbox
}: DropDownProfileProps) {
    const user = useAppSelector(state => state.user.currentUser);
    const [isActive, setActive] = useState(active);
    const windowWidth = useWindowWidth();
    const router = useRouter();

    useEffect(() => {
        setActive(active);
    }, [active]);

    const handleNavigation = (path: string) => {
        if (router) {
            router.push(path);
        }
    };

    return (
        <DropDown
            className={`flex flex-col items-center ${styles.userPanel}`}
            active={isActive}
        >
            {(!minwidthToUnbox || windowWidth <= minwidthToUnbox) && (
                <>
                    <ProfileAvatar className='my-3 rounded-full' />
                    <div className='mb-2'>
                        <div className='flex'>
                            <p className='mr-2'>{user?.name}</p>
                            <p>{user?.surname !== "." && user?.surname}</p>
                        </div>
                        <p>{user?.email}</p>
                    </div>
                </>
            )}
            <button
                type='button'
                onClick={() => handleNavigation('/profile')}
            >
                Profile
            </button>
            <button
                type='button'
                onClick={() => handleNavigation('/chats')}
            >
                Chats
            </button>
            <button
                type='button'
                onClick={() => handleNavigation('/adding')}
            >
                Add product
            </button>
            <Logout />
        </DropDown>
    );
}
