import styles from './ErrorWrapper.module.css';

export type ErrorWrapperProps = Readonly<{
    children: React.ReactNode,
    errorMessage?: string,
    icon?: React.ReactNode,
    className?: string,
    noticeMessage?: string,
}>

export default function ErrorWrapper({
    children,
    errorMessage,
    icon,
    className = '',
    noticeMessage,
}: ErrorWrapperProps) {
    return(
        <>
            <div className={`w-full mb-2.5 ${className}`}>
                {children}
                {icon}
            </div>
            {errorMessage ?
                <p className={`${styles.textWrapper} error-text ${errorMessage ? 'mb-3' : ''}`}>{errorMessage}</p>
                :
                <p className={`${styles.textWrapper} ${noticeMessage ? 'mb-3' : ''}`}>{noticeMessage}</p>
            }
        </>
    );
}