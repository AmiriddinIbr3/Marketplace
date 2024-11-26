import styles from './TextMessageAndAvatar.module.css';
import Avatar, { AvatarProps } from '../Avatar/Avatar';
import TextMessage, { TextMessageProps } from '../TextMessage/TextMessage';

export type TextMessageAndAvatarProps = TextMessageProps & AvatarProps & {
    className?: string,
};

export default function TextMessageAndAvatar({
    right = false,
    text,
    time,
    className='pb-2',
    textClassName='!mb-0',
    avatarClassName='',
    size=40,
    url,
    username,
}: TextMessageAndAvatarProps) {
    return(
        <div className={`${className} ${styles.message} ${right && styles.right}`}>
            <Avatar
                avatarClassName={avatarClassName}
                size={size}
                url={url}
            />
            <TextMessage
                right={right}
                text={text}
                time={time}
                textClassName={textClassName}
                username={username}
            />
        </div>
    );
}