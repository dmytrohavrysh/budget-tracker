import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import ThemeSwitcher from '../ThemeSwitcher';
import AccountMenu from '../AccountMenu';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={`wrapper ${styles.wrapper}`}>
                <nav className={styles.menu}>
                    <ul className={styles.menu__list}>
                        <li className={styles.menu__item}>
                            <Link to="/" className={styles.menu__link}>Home</Link>
                        </li>
                        <li className={styles.menu__item}>
                            <Link to="/statistic" className={styles.menu__link}>Statistic</Link>
                        </li>

                    </ul>
                </nav>
                <ThemeSwitcher />
                <AccountMenu />
            </div>
        </header>
    );
}

export default Header;