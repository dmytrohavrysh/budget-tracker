import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import Alert from '../../components/Alert';
import {initCollection} from '../../providers/services/Storage'
import styles from './Login.module.css';

function Login() {
    const [displayedForm, setDisplayedForm] = useState('Log In');
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const changeLocation = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();
    const newEmailRef = useRef();
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();
    const resetEmailRef = useRef();
    const {signUp, login, resetPassword, currUser} = useAuth();

    useEffect(() => {
        if(currUser.emailVerified) {
            changeLocation('/')
        }
    }, [])

    const switchForm = (e) => {
        setDisplayedForm(e.target.textContent)
    }

    const handleSignup = async (e) => {
        setError('');
        e.preventDefault();
        if(newPasswordRef.current.value !== confirmPasswordRef.current.value) {
            setError("Passwords do not match")
            return
        }
        try {
            setIsLoading(true);
            await signUp(newEmailRef.current.value, newPasswordRef.current.value);
            setDisplayedForm('Confirm');
        } catch(e) {
            console.log(e);
            setError(e.message.slice(e.message.indexOf(' ') + 1, e.message.indexOf('(')))
        } finally {
            setIsLoading(false);
        }    
    }

    const handleLogin = async (e) => {
        setError('');
        e.preventDefault();        
        try {
            setIsLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            if(currUser && currUser.emailVerified) {
                initCollection(emailRef.current.value);
                changeLocation('/');
            } else {
                setDisplayedForm('Confirm')
            }
            
        } catch(e) {
            setError('Email and/or password are incorrect')
        } finally {
            setIsLoading(false);
        }
    }

    const handleReset = async (e) => {
        e.preventDefault();        
        try {
            setIsLoading(true);
            await resetPassword(resetEmailRef.current.value);
            setSuccess('Password reset email sent!')
        } catch(e) {
            switch(e.code) {
                case 'user-not-found': setError('User with this email is not registered');break;
                case 'auth/invalid-email': setError('Invalid email');break;
                default: setError('Something went wrong...')
            }
            
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.forms}>
        {displayedForm === "Log In" ? <>
            <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.form__header}>
                    <h2 className={styles.form__heading}>Log In</h2>
                </div>
                <div className={styles.form__body}>
                    <label className={styles.label}>
                        <input type="email" ref={emailRef} className={styles.input} required/>
                        <span className={styles.label__span}>Email</span>
                    </label>
                    <label className={styles.label}>
                        <input type="password" ref={passwordRef} className={styles.input} required/>
                        <span className={styles.label__span}>Password</span>
                    </label>
                    <button type="submit" className="btn">Log In</button>
                    <button onClick={switchForm} className={styles.link}>Forgot password?</button>
                </div>
            </form>
            <p>Need an account? <button onClick={switchForm} className={styles.link}>Sign Up</button></p>
            </>: displayedForm === "Sign Up" ? <>
            <form className={styles.form} onSubmit={handleSignup}>
                <div className={styles.form__header}>
                    <h2 className={styles.form__heading}>Sign Up</h2>
                </div>
                <div className={styles.form__body}>
                    <label className={styles.label}>
                        <input type="email" ref={newEmailRef} className={styles.input} required/>
                        <span className={styles.label__span}>Email</span>
                    </label>
                    <label className={styles.label}>
                        <input type="password" ref={newPasswordRef} className={styles.input} required/>
                        <span className={styles.label__span}>Password</span>
                    </label>
                    <label className={styles.label}>
                        <input type="password" ref={confirmPasswordRef} className={styles.input} required/>
                        <span className={styles.label__span}>Confirm Password</span>
                    </label>
                    <button type="submit" disabled={isLoading} className="btn">Sign Up</button>
                </div>
            </form>
            <p>Already have an account? <button onClick={switchForm} className={styles.link}>Log In</button></p>
            </> : displayedForm === "Forgot password?" ? <> 
            <form className={styles.form} onSubmit={handleReset}>
                <div className={styles.form__header}>
                    <h2 className={styles.form__heading}>Reset Password</h2>
                </div>
                <div className={styles.form__body}>
                    <label className={styles.label}>
                        <input type="email" ref={resetEmailRef} className={styles.input} required/>
                        <span className={styles.label__span}>Email</span>
                    </label>
                    <button type="submit" className="btn">Reset Password</button>
                    <button onClick={switchForm} disabled={isLoading} className={styles.link}>Log In</button>
                </div>
            </form>
            </>: <>
                <Alert type={'success'}>To start using the application, you need to follow the link we sent you by email.</Alert>
            </>}
            {error ?
                <Alert type={'error'}>{error}</Alert>
                : null
            }
            {success ?
                <Alert type={'success'}>{success}</Alert>
                : null
            }
        </div>
    )
}

export default Login;