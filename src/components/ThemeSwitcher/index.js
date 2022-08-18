import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../../providers/context/Settings';
import styles from './ThemeSwitcher.module.css';

const ThemeSwitcher = () => {

    const {settingsState, dispatchSettings} = useContext(SettingsContext);
    const [theme, setTheme] = useState(settingsState.theme);

    useEffect(() => setTheme(settingsState.theme), [])

    const toggleTheme = (e) => {
        const newTheme = e.target.textContent.toLowerCase();
        setTheme(newTheme);
        dispatchSettings({type: 'changeTheme', payload: newTheme})
    }

                

    
    return (
        <div className="theme-switcher">
            <h3 className={`${styles.heading} visually-hidden`}>Theme: </h3>
            <div className={styles.themes}>
                <button className={`${styles.themes__item} ${styles.themes__item__light} ${theme === 'light' ? styles.themes__item__active: ''}`} onClick={toggleTheme}>Light</button>
                <button className={`${styles.themes__item} ${styles.themes__item__auto}  ${theme === 'auto' ? styles.themes__item__active: ''}`} onClick={toggleTheme}>Auto</button>
                <button className={`${styles.themes__item} ${styles.themes__item__dark}  ${theme === 'dark' ? styles.themes__item__active: ''}`} onClick={toggleTheme}>Dark</button>
                <div className={styles.indicator} tabIndex="-1"></div>
            </div>
        </div>
    );
}

export default ThemeSwitcher;