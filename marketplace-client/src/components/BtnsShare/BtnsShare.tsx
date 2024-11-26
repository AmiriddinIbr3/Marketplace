"use client";
import Link from 'next/link';
import styles from './BtnsShare.module.css';
import { usePathname } from 'next/navigation'

export type BtnsShareProps = {
    url?: string,
    text?: string,
}

export default function BtnsShare({
    url,
    text
}: BtnsShareProps) {
    const pathname = usePathname();

    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(url || `${process.env.NEXT_PUBLIC_HOST_URL}/${pathname}`)}`;
    
    if (text) {
        telegramShareUrl.concat(`&text=${encodeURIComponent(text)}`);
    }

    return (
        <Link href={telegramShareUrl} target="_blank" rel="noopener noreferrer">
            Share on Telegram
        </Link>
    );
}