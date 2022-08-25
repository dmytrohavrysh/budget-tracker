import styles from './AccountMenu.module.css';
import { memo } from "react";
import { useAuth } from "../../hooks/useAuth"
import { Link } from 'react-router-dom';

function AccountMenu() {
    const {currUser, logout} = useAuth();
    return (
        <div className={styles.account__menu}>
            {currUser ?
                <button className={styles.menu__item} >{currUser.displayName ? currUser.displayName : currUser.email}</button>
            :
                <Link className={styles.menu__item} to="/login">Log In</Link>
            }
            {currUser &&
            <ul className={styles.list}>
                <li className={styles.list__item}><Link className={styles.link} to="/account">Settings</Link></li>
                <li className={styles.list__item}><button className={styles.link} onClick={logout}>Log Out</button></li>
            </ul>
            }
        </div>
    )
}

export default memo(AccountMenu);