import { updateProfile as firebaseUpdateProfile, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider,
    sendPasswordResetEmail,
    signOut
 } from 'firebase/auth';
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
    const logout = () => {
        return signOut(auth);
    }


    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const updateProfile = async ({name, currPassword, newPassword}) => {
        let promises = []
        let newProfile = {}
        if(name) {
            newProfile["displayName"] = name
        }
        promises.push(firebaseUpdateProfile(currUser, {...newProfile}))

        if(newPassword !== '') {
            await reauthenticateWithCredential(currUser, EmailAuthProvider.credential(currUser.email, currPassword))
            promises.push(updatePassword(currUser, newPassword))
        }
        return Promise.all(promises).then(() => 'Updated!').catch(e => {
            throw e
        })
    }

    const value = {
        currUser,
        signUp,
        login,
        logout,
        resetPassword,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export {AuthProvider, AuthContext};