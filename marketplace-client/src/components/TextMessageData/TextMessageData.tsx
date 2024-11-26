import styles from './TextMessageData.module.css';

export type TextMessageDataProps = {
    data: string;
    dataClassName?: string;
};

export default function TextMessageData({
    data,
    dataClassName = '!my-4',
}: TextMessageDataProps) {
    return (
        <div className={`${styles.wrapper} ${dataClassName}`}>
            <p className={styles.data}>{data}</p>
        </div>
    );
}