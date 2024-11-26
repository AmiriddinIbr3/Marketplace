"use client";
import styles from './Navbar.module.css';
import logoIcon from './Img/logo.png';
import arrowIcon from './Img/arrow.png';
import bellIcon from './Img/bell.png';
import Image from 'next/image';
import Link from 'next/link';
import BtnsColour from '../BtnsColour/BtnsColour';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import Search from '../Search/Search';
import DropDownProfile from '../DropDownProfile/DropDownProfile';
import DropDownNotifications from '../DropDownNotifications/DropDownNotifications';
import useWindowWidth from '@/hooks/useWindowWidth';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux';
import Notice from '../Notice/Notice';
import { useModal } from "@/providers/ModalContext";

export default function Navbar() {
    const [isUserPanelOpened, setUserPanelOpen] = useState(false);
    const [isNotificationsPanelOpened, setNotificationsPanelOpened] = useState(false);
    
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setUserPanelOpen(false);
        setNotificationsPanelOpened(false);
    }, [pathname, searchParams]);

    const minwidthToUnbox = 800;
    const windowWidth = useWindowWidth();
    const user = useAppSelector(state => state.user.currentUser);
    const isLoggedIn = !!user;
    const notices = useAppSelector(state => state.notices.notices);
    const count = useAppSelector(state => state.notices.count);

    const { openModal } = useModal();

    const handleLogin = () => openModal('login');
    const handleRegister = () => openModal('register');

    return (
        <nav className={`${styles.navbar} flex items-center justify-between`}>
            <Link href="/">
                <Image
                    src={logoIcon}
                    width={50}
                    height={50}
                    alt="Logo"
                    priority
                />
            </Link>

            <Search minwidthToUnbox={minwidthToUnbox} />

            {isLoggedIn ? (
                <div className='flex'>
                    <div className='relative mr-3'>
                        <div className='h-full flex items-center'>
                            <button
                                className={`${styles.dropdownNotificationsSwitcher} ${isNotificationsPanelOpened ? styles.opened : ''}`}
                                type='button'
                                onClick={() => setNotificationsPanelOpened(!isNotificationsPanelOpened)}
                            >
                                <Image
                                    src={bellIcon}
                                    width={35}
                                    height={35}
                                    alt="bell icon"
                                />
                            </button>
                            {count > 0 && (
                                <p className={styles.notificationsNumber}>{count}</p>
                            )}
                        </div>
                        <DropDownNotifications active={isNotificationsPanelOpened}>
                            {notices.length > 0 ? (
                                notices.map((notice) => (
                                    <Notice
                                        key={notice.id}
                                        id={notice.id}
                                        title={notice.title}
                                        body={notice.body}
                                        checked={notice.checked}
                                        createdAt={notice.createdAt}
                                    />
                                ))
                            ) : (
                                <p className='py-2 w-full flex justify-center'>No notifications</p>
                            )}
                        </DropDownNotifications>
                    </div>
                    <div className='relative'>
                        <div className='flex items-center'>
                            <ProfileAvatar className='mr-3 rounded-full' />
                            {(!minwidthToUnbox || windowWidth >= minwidthToUnbox) && 
                                <div>
                                    <div className='flex'>
                                        <p className='mr-2'>{user?.name}</p>
                                        <p>{user?.surname !== "." && user?.surname}</p>
                                    </div>
                                    <p>{user?.email}</p>
                                </div>
                            }
                            <button
                                className={`${styles.dropdownProfileSwitcher} ${isUserPanelOpened ? styles.opened : ''}`}
                                type='button'
                                onClick={() => setUserPanelOpen(!isUserPanelOpened)}
                            >
                                <Image
                                    src={arrowIcon}
                                    width={15}
                                    height={15}
                                    alt="arrow icon"
                                />
                            </button>
                        </div>
                        <DropDownProfile
                            active={isUserPanelOpened}
                            minwidthToUnbox={minwidthToUnbox}
                        />
                    </div>
                </div>
            ) : (
                <BtnsColour className="btns-wrapper">
                    <button type="button" onClick={handleRegister}>Register</button>
                    <button type="button" onClick={handleLogin}>Login</button>
                </BtnsColour>
            )}
        </nav>
    );
}