import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import "./index.css";
import { TransactionsProvider } from './providers/context/Transactions';
import { CategoriesProvider } from './providers/context/Categories';
import { CurrenciesProvider } from './providers/context/Currencies';
import { SettingsProvider } from './providers/context/Settings';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <SettingsProvider value={{}}>
        <TransactionsProvider value={[]}>
            <CategoriesProvider value={[]}>
                <CurrenciesProvider value={[]}>
                    <App/>
                </CurrenciesProvider>
            </CategoriesProvider>
        </TransactionsProvider>
    </SettingsProvider>
    
);

