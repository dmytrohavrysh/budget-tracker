import styles from './Alert.module.css';

function Alert({type, children}) {
  return (
    <div className={styles[type]}>{children}</div>
  )
}

export default Alert;