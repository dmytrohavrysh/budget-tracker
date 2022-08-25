import { useRef, useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import styles from "./Account.module.css";
import Alert from "../../components/Alert";

const Account = () => {
    const {currUser, updateProfile} = useAuth();
    const nameRef = useRef();
    const passwordRef = useRef();
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("")
        const name = nameRef.current.value;
        const pass = passwordRef.current.value;
        const newPass = newPasswordRef.current.value;
        const confPass = confirmPasswordRef.current.value;

        if(newPass !== confPass) {
            setError("Passwords do not match");
            return;
        }
        if((newPass || confPass) && !pass) {
            setError("The current password must be entered")
            return
        }
        try {
            const result = await updateProfile({name: name, currPassword: pass, newPassword: newPass})
            if(result === 'Updated!') {
                setSuccess('Your profile is successfully updated!')
            }
        } catch(e) {
            if(e.code === 'auth/wrong-password') {
                setError(`Can't update profile: wrong current password`)
            } else {
                setError(`Can't update profile: ${e?.message?.slice(e.message.indexOf(' ') + 1, e.message.indexOf('('))}`)
            }
            
        }
        
    }

    return (
        <div className={styles.account}>
            <h1 className={styles.heading}>Account</h1>
            <form className={styles.form} onSubmit={handleUpdate}>
                <div className={styles.form__body}>
                    <label className={styles.label}>
                        <span className={styles.label__span}>Name: </span><input type="text" defaultValue={currUser?.displayName} placeholder="Your name" ref={nameRef} className={styles.input}/>
                    </label>

                    <label className={styles.label}>
                        <span className={styles.label__span}>Email: </span><input type="email" value={currUser.email} disabled={true} readOnly={true} className={styles.input}/>
                    </label>
                    <label className={styles.label}>
                        <span className={styles.label__span}>Current password: </span>
                        <input type="password" ref={passwordRef} placeholder="Current password" className={styles.input} />
                    </label>
                    <label className={styles.label}>
                        <span className={styles.label__span}>New password: </span>
                        <input type="password" ref={newPasswordRef} placeholder="New password" className={styles.input} />
                    </label>
                    <label className={styles.label}>
                        <span className={styles.label__span}>Confirm password: </span>
                        <input type="password" ref={confirmPasswordRef} placeholder="Confirm new password" className={styles.input} />
                    </label>
                    <button type="submit" className="btn">Update</button>
                </div>
            </form>
            {error ?
                <Alert type={'error'}>{error}</Alert>
                : null
            }
            {success ?
                <Alert type={'success'}>{success}</Alert>
                : null
            }
            
        </div>
    );
}

export default Account;