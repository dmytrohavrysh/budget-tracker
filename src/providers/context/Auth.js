import React, { createContext, useEffect, useState } from 'react'
import { auth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../../firebase';

const AuthContext = createContext();

function AuthProvider({children}) {
    const [currUser, setCurrUser] = useState()
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrUser(user)
            setIsLoading(false);
        })
        return unsubscribe;
    }, [])

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    } 


    const value = {
        currUser,
        signUp,
        login
    }

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export {AuthProvider, AuthContext};