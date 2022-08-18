import { createContext, useEffect } from "react";
import useAsyncReducer from "../../hooks/useAsyncReducer";
import { init, addTransaction, updateTransactions } from "../services/Storage";

const TransactionsContext = createContext([]);

const reducer = (oldState, action) => {
    return new Promise(resolve => {
        switch (action.type) {
            case 'updateTransactions': {
                updateTransactions().then(data => resolve(data))
                break;
            }
            case 'addTransaction':
                const date = new Date(action.payload.date);
                const data = {...action.payload, date: date};
                addTransaction(data).then((data) => resolve(data));
                break;
            default: resolve(oldState);
        }
    });
}

const TransactionsProvider = ({children}) => {
    const [transactionsState, dispatchTransactions] = useAsyncReducer(reducer, []);

    useEffect(() => {
        init()
        dispatchTransactions({type: 'updateTransactions'});
        
    }, []);

    const value = {transactionsState, dispatchTransactions};
    return ( <TransactionsContext.Provider value={value} >{children}</TransactionsContext.Provider> );
}

export { TransactionsContext, TransactionsProvider };