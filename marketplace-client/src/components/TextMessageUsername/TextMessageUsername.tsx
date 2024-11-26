import styles from './TextMessageUsername.module.css';

export type TextMessageUsernameProps = {
    username?: string;
};

export default function TextMessageUsername({
    username
}: TextMessageUsernameProps) {
    return (
        <p className={styles.username}>{username}</p>
    );
}