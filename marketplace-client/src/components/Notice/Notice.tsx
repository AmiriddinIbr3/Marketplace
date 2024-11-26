import { INotice } from '@/types/notification/INotice';
import { formatTimeAgo } from '@/helpers/formatDate';
import styles from './Notice.module.css';

export type NoticeProps = INotice;

export default function Notice({
    id,
    title,
    body,
    checked,
    createdAt,
}: NoticeProps) {
    return(
        <div className={`${styles.notice} ${!checked && styles.nonChecked} py-2`}>
            <p className={styles.title}>{title}</p>
            <p className={styles.body}>{body}</p>
            <p className={styles.date}>{formatTimeAgo(createdAt)}</p>
        </div>
    );
}