import { createContext, useEffect } from "react";
import useAsyncReducer from "../../hooks/useAsyncReducer";

const SettingsContext = createContext([]);
const availableThemes = ['light', 'dark', 'auto'];
let lightStyles = document.querySelectorAll('link[rel="stylesheet"][media*=prefers-color-scheme][media*=light]');;
let darkStyles = document.querySelectorAll('link[rel="stylesheet"][media*=prefers-color-scheme][media*=dark]');


const reducer = (oldState, action) => {
    return new Promise(resolve => {
        switch (action.type) {
            case 'setSettings': {
                resolve({...oldState, theme: action.payload});
                break;
            }
            case 'changeTheme': {
                if(availableThemes.includes(action.payload)) {
                    updateTheme(action.payload);   
                    resolve({...oldState, theme: action.payload});
                    break;
                }
            }
            
            default: resolve(oldState);
        }
    });
}

const updateTheme = (newTheme) => {
    let lightMedia;
    let darkMedia;
    if(newTheme === 'auto') {
        localStorage.removeItem('theme');
        lightMedia = '(prefers-color-scheme: light)';
        darkMedia = '(prefers-color-scheme: dark)';
    } else {
        localStorage.setItem('theme', newTheme);
        lightMedia = newTheme === 'light' ? 'all': 'not all'
        darkMedia = newTheme === 'dark' ? 'all': 'not all'
    }
    [...lightStyles].forEach(link => link.media = lightMedia);
    [...darkStyles].forEach(link => link.media = darkMedia);
}


const SettingsProvider = ({children}) => {
    let currTheme = localStorage.getItem('theme');
    currTheme = currTheme ? currTheme : 'auto';

    const [settingsState, dispatchSettings] = useAsyncReducer(reducer, {
        locale: 'en-US',
        theme: currTheme
    });

    useEffect(() => {
        updateTheme(currTheme)
    }, [])

    const value = {settingsState, dispatchSettings};
    return ( <SettingsContext.Provider value={value} >{children}</SettingsContext.Provider> );
}

export { SettingsContext, SettingsProvider };