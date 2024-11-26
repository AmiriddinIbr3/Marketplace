"use client";
import styles from './SiteWrapper.module.css';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AuthorizationForm from "../Forms/AuthorizationForm/AuthorizationForm";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { addNotice, setNotices } from '@/redux/noticesSlice';
import { getAccessToken } from '@/helpers/tokenHelper';
import NotificationServiceRest from '@/services/RestAPI/requests/notificationService';
import useCheckAuth from '@/hooks/useCheckAuth';
import { store } from '@/redux';
import SSEClient from '@/services/SSEConnections/SSEClient';
import { INotice } from '@/types/notification/INotice';
import { usePathname } from 'next/navigation';

export type SiteWrapperProps = Readonly<{
    children: React.ReactNode;
}>;

export default function SiteWrapper({
    children,
}: SiteWrapperProps) {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { isLoading, data: userData } = useCheckAuth();
    const accessToken = getAccessToken();
    const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        NotificationServiceRest.getNotices()
            .then(notices => {
                dispatch(setNotices(notices.data));
            });

        if (accessToken && ApiUrl) {
            const notificationServiceSSE = new SSEClient<INotice>(ApiUrl, "user/notification");
            const subject = notificationServiceSSE.createSSEConnection(undefined, accessToken);

            subject.subscribe({
                next: (data) => {
                    store.dispatch(addNotice(data));
                }
            });
        }
    }, [accessToken, ApiUrl, dispatch]);

    if (isLoading) {
        return (
            <div className="flex items-center h-full w-full justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    const shouldRenderAuthorizationForm = !userData;

    return (
        <div className={styles.wrapper}>
            {pathname === "chats" ? (
                <>
                    <Navbar />
                        <main className={styles.content}>
                            {children}
                        </main>
                    <Footer />
                </>
            ) : (
                <main className={styles.content}>
                    {children}
                </main>
            )}
            
            {shouldRenderAuthorizationForm && <AuthorizationForm />}
        </div>
    );
}