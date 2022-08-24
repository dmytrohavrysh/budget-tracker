import { useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const [displayedForm, setDisplayedForm] = useState('Log In');
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const changeLocation = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();
    const newEmailRef = useRef();
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();
    const resetEmailRef = useRef();
    const {signUp, login} = useAuth();

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
            changeLocation('/');
        } catch(e) {
            setError(e.message.slice(e.message.indexOf(' ') + 1))
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
            changeLocation('/');
        } catch(e) {
            setError('Email and/or password are incorrect')
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
            </> : <> 
            <form className={styles.form}>
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
            </>}
            {error ?
                <div className={styles.error}>{error}</div>
                : null
            }
        </div>
    )
}

export default Login;