import styles from './Search.module.css';
import magnifyingGlassIcon from './Img/magnifying-glass.png';
import Image from 'next/image';
import useWindowWidth from '@/hooks/useWindowWidth';
import { useEffect, useState } from 'react';

export type SearchProps = {
    minwidthToUnbox?: number,
};

export default function Search({ minwidthToUnbox }: SearchProps) {
    const windowWidth = useWindowWidth();
    const [isUploaded, setUploaded] = useState<boolean>();
    
    useEffect(() => {
        setUploaded(true);
    }, [windowWidth]);

    if (!isUploaded) {
        return null;
    }

    if(!minwidthToUnbox || windowWidth >= minwidthToUnbox) {
        return(
            <span className='flex'>
                <input type="text" className={styles.searchInput}/>
                <button type='button' className={styles.searchbtn}>
                    <Image
                        src={magnifyingGlassIcon}
                        alt="magnifying glass icon"
                        width={20}
                        height={20}
                    />
                </button>
            </span>
        );
    }
    else {
        return(
            <button type='button' className={`${styles.searchbtn} ${styles.minWidth}`}>
                <Image
                    src={magnifyingGlassIcon}
                    alt="magnifying glass icon"
                    width={20}
                    height={20}
                />
            </button>
        );
    }
}