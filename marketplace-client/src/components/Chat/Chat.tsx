import styles from './Chat.module.css';
import Avatar from '@/components/Avatar/Avatar';

export type ChatProps = {
    title: string,
    lastMessage: string,
}

export default function Chat({
    title,
    lastMessage,
}: ChatProps) {
    return(
        <div className={styles.chat}>
            <Avatar
                avatarClassName='rounded-full mr-2'
            />
            <div>
                <span className={styles.titleInfo}>
                    <p className={styles.title}>{title}</p>
                </span>
                <span className={styles.descriptionInfo}>
                    <p className={styles.lastMessage}>{lastMessage}</p>
                </span>
            </div>
        </div>
    );
}