import styles from './Error.module.css';

export function Error(props) {
    return (
        <>
            <div className={styles.errorSmile}></div>
            <h2 className={styles.errorText}>{props.children}</h2>
        </>
    );
}