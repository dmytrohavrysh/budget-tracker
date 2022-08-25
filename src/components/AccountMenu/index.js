import styles from './AccountMenu.module.css';
import { useAuth } from "../../hooks/useAuth"
import { Link } from 'react-router-dom';

function AccountMenu() {
    const {displayUser, logout} = useAuth();
    return (
        <div className={styles.account__menu}>
            {displayUser ?
                <button className={styles.menu__item} >{displayUser.displayName ? displayUser.displayName : displayUser.email.slice(0, displayUser.email.indexOf('@'))}</button>
            :
                <Link className={styles.menu__item} to="/login">Log In</Link>
            }
            {displayUser &&
            <ul className={styles.list}>
                <li className={styles.list__item}><Link className={styles.link} to="/account">Settings</Link></li>
                <li className={styles.list__item}><button className={styles.link} onClick={logout}>Log Out</button></li>
            </ul>
            }
        </div>
    )
}

export default AccountMenu;