import { createContext, useEffect, useReducer } from "react";
import { currenciesService } from "../services/FirestoreService";

const CurrenciesContext = createContext([]);

const reducer =  (oldState, action) => {
    switch (action.type) {
        case 'getCurrencies': {
            return action.payload; 
        }
        default: return oldState;
    }
}

const CurrenciesProvider = ({children}) => {
    const [currenciesState, dispatchCurrencies] = useReducer(reducer, []);

    useEffect(() => {
        currenciesService.getCurrencies().then(currencies => {
            dispatchCurrencies({type: 'getCurrencies', payload: currencies});
        }).catch(error => {
            console.log('Error getting currencies: ', error);
        })
    }, []);

    const value = {currenciesState, dispatchCurrencies};
    return ( <CurrenciesContext.Provider value={value} >{children}</CurrenciesContext.Provider> );
}

export { CurrenciesContext, CurrenciesProvider };