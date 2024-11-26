import styles from './TextMessage.module.css';
import TextMessageUsername, { TextMessageUsernameProps } from '../TextMessageUsername/TextMessageUsername';

export type TextMessageProps = TextMessageUsernameProps & {
    right?: boolean;
    text: string;
    time: string;
    textClassName?: string;
    withPaddingForAvatar?: boolean;
};

export default function TextMessage({
    right = false,
    text,
    time,
    textClassName = 'mb-2',
    withPaddingForAvatar = false,
    username,
}: TextMessageProps) {
    
    return (
        <>
            <div className={`${styles.message} ${withPaddingForAvatar && (
                right ? styles.paddingRightAfterAvatar : styles.paddingLeftAfterAvatar
            )} ${right && styles.right} ${styles.droplet} ${textClassName}`}>
                <TextMessageUsername username={username} />
                <p className={styles.messageText}>
                    {text}
                    <span className={styles.messageTime}>{time}</span>
                </p>
            </div>
            <svg height="0" width="0">
                <defs>
                    <clipPath id="left-droplet">
                        <path d="M 10,0 A 10,10 0 0 1 0,10 H 16 V 0 Z" />
                    </clipPath>
                    <clipPath id="right-droplet">
                        <path d="M 6,0 A 10,10 0 0 0 16,10 H 0 V 0 Z" />
                    </clipPath>
                </defs>
            </svg>
        </>
    );
}