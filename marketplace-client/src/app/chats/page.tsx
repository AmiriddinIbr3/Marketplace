"use client";
import Image from 'next/image';
import styles from './chats.module.css';
import clipIcon from './Img/clip.png';
import sendIcon from './Img/send.png';
import { useEffect, useRef } from 'react';
import Chat from '@/components/Chat/Chat';
import TextMessage from '@/components/TextMessage/TextMessage';
import TextMessageAndAvatar from '@/components/TextMessageAndAvatar/TextMessageAndAvatar';
import TextMessageData from '@/components/TextMessageData/TextMessageData';

export default function Chats() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const maxHeight = 100;

    useEffect(() => {
        const textarea = textareaRef.current;

        if (textarea) {
            const adjustHeight = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
            };

            textarea.addEventListener('input', adjustHeight);
            textarea.addEventListener('change', adjustHeight);
            window.addEventListener('resize', adjustHeight);
            adjustHeight();

            return () => {
                textarea.removeEventListener('input', adjustHeight);
                textarea.removeEventListener('change', adjustHeight);
                window.removeEventListener('resize', adjustHeight);
            };
        }
    }, []);

    return(
        <div className={styles.container}>
            <div className={styles.chatsWrapper}>
                {/* <Chat
                    title='Канал по продвежению и набору подписчиков. Все идем сюда!!!'
                    lastMessage='Сегодня было собрание подписчиков на сквере Амира Темура и там было классно!!!'
                /> */}
            </div>
            <div className={styles.chatWrapper}>
                <div className={styles.topTab}>
                    <div>
                        <p className={styles.name}>Amir</p>
                        <p className={`${styles.surname} ml-1`}>Ibragimov</p>
                    </div>
                    <p className={styles.lastTime}>was online recently</p>
                </div>
                <div className={styles.body}>
                    <TextMessage
                        text='Amir is walking'
                        time='11: 30'
                        textClassName='!mt-3'
                        withPaddingForAvatar={true}
                        username="Amir's mom"
                    />
                    <TextMessage
                        text='Amir is walking'
                        time='11: 30'
                        withPaddingForAvatar={true}
                    />
                    <TextMessage
                        text='Amir is walking'
                        time='11: 30'
                        withPaddingForAvatar={true}
                    />
                    <TextMessage
                        text='Amir is walking'
                        time='11: 30'
                        withPaddingForAvatar={true}
                    />
                    <TextMessage
                        text='Amir is walking'
                        time='11: 30'
                        withPaddingForAvatar={true}
                    />
                    <TextMessage
                        text='Amir is walking'
                        time='11: 30'
                        withPaddingForAvatar={true}
                    />
                    <TextMessageAndAvatar
                        text='Amir is walking'
                        time='11: 30'
                    />
                    <TextMessageData
                        data='12 September'
                    />
                    <TextMessage
                        text='Канал по продвежению и набору подписчиков. Все идем сюда!!! АААААААААААААААААААААibdnribdiubndfjbndiufnbudfnvuigsnhbvskjeviushiuvhsgduighuisdghifj'
                        time='11: 30'
                        withPaddingForAvatar={true}
                        right={true}
                        username='Vladilen Minin'
                    />
                    <TextMessageAndAvatar
                        text='Канал по продвежению и набору подписчиков. Все идем сюда!!! АААААААААААААААААААААibdnribdiubndfjbndiufnbudfnvuigsnhbvskjeviushiuvhsgduighuisdghifj'
                        time='11: 30'
                        right={true}
                    />
                </div>
                <div className={styles.input}>
                    <button
                        className={styles.clip}
                        type='button'
                    >
                        <Image
                            src={clipIcon}
                            width={20}
                            height={20}
                            alt="clip icon"
                        />
                    </button>
                    <textarea ref={textareaRef} />
                    <button
                        className={styles.send}
                        type='button'
                    >
                        <Image
                            src={sendIcon}
                            width={20}
                            height={20}
                            alt="clip icon"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}