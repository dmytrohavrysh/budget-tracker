import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import "./index.css";
import { SettingsProvider } from './providers/context/Settings';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SettingsProvider><App/></SettingsProvider>);
    
    