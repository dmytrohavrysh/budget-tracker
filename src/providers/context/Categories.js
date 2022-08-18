import { createContext, useEffect, useReducer } from "react";
import { categoriesService } from "../services/FirestoreService";

const CategoriesContext = createContext([]);

const reducer =  (oldState, action) => {
    switch (action.type) {
        case 'getCategories': {
            return action.payload; 
        }
        default: return oldState;
    }
}

const CategoriesProvider = ({children}) => {
    const [categoriesState, dispatchCategories] = useReducer(reducer, []);

    useEffect(() => {
        categoriesService.getCategories().then(categories => {
            dispatchCategories({type: 'getCategories', payload: categories});
        }).catch(error => {
            console.log('Error getting categories: ', error);
        })
    }, []);

    const value = {categoriesState, dispatchCategories};
    return ( <CategoriesContext.Provider value={value} >{children}</CategoriesContext.Provider> );
}

export { CategoriesContext, CategoriesProvider };