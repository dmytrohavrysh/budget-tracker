import { Link } from 'react-router-dom';
import styles from './Header.module.css';

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
                <button className={styles.user}>User</button>
            </div>
        </header>
    );
}

export default Header;