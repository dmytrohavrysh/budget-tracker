import { updateProfile as firebaseUpdateProfile, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider,
    sendPasswordResetEmail,
    signOut,
    sendEmailVerification
 } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import { auth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../../firebase';

const AuthContext = createContext();

function AuthProvider({children}) {
    const [currUser, setCurrUser] = useState();
    const [displayUser, setDisplayUser] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async user => { 
            setCurrUser(user)
            setDisplayUser(user ? {email: user.email, displayName: user.displayName} : null)
            setIsLoading(false);
        })
        return unsubscribe;
    }, [])

    const signUp = async (email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if(currUser && !currUser.emailVerified) {
            await verifyEmail(currUser);
        }
        return result
    }

    const verifyEmail = (user) => {
        return sendEmailVerification(user)
    }

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if(currUser && !currUser.emailVerified) {
            await verifyEmail(currUser);
        }
        return result;
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
        return Promise.all(promises).then(() => {
            setDisplayUser({email: currUser.email, displayName: currUser.displayName})
            return 'Updated!'
        }).catch(e => {
            throw e
        })
    }

    const value = {
        currUser,
        displayUser,
        signUp,
        login,
        logout,
        resetPassword,
        updateProfile,
        verifyEmail
    }

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export {AuthProvider, AuthContext};