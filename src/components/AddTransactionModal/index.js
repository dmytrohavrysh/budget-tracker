import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import styles from './AddTransactionModal.module.css';

import { collection, doc, getDocs, addDoc } from "firebase/firestore";
import {firestore} from "../../firebase";

const formatDate = (date) => {
    const d = new Date(date);
    let month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = d.getDate();
    day = day < 10 ? '0' + day : day;
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

const AddTransactionModal = ({isOpen, setModal}) => {
    const [categories, setCategories] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [formData, setFormData] = useState({
        type: 'expense',
        sum: '0.01',
        from: '',
        category: '',
        currency: '',
        date: formatDate(new Date())
    });
    
    
    // Disable the content when the modal is open
    useEffect(() => {
        ReactModal.setAppElement('#root');
    }, []);
    // Get the categories from the database
    useEffect(() => {
        (async () => {
            let categoriesSnapshot;
            try{
                categoriesSnapshot = await getDocs(collection(firestore, "categories"));
            } catch (error) {
                console.log('Error getting categories: ', error);
                return;
            }
            const cats = [];
            categoriesSnapshot.forEach(async doc => {
                cats.push({name: doc.data().name, id: doc.id});
            })
            setCategories(cats);
            setFormData({...formData, category: cats.length > 0 ? cats[0].id : ''});
        })();
    }, categories);
    // Get the currencies from the database
    useEffect(() => {
        (async () => {
            let currenciesSnapshot;
            try {
                currenciesSnapshot = await getDocs(collection(firestore, "currencies"));
            } catch (error) {
                console.log('Error getting currencies: ', error);
                return;
            }
            const curs = [];
            currenciesSnapshot.forEach(async doc => {
                curs.push({data: doc.data(), id: doc.id});
            })
            setCurrencies(curs);
            setFormData({...formData, currency: curs.length > 0 ? curs[0].id : ''});
        })();
    }, categories);

    const addTransaction = async (e) => {
        e.preventDefault();
        const categoryRef = doc(firestore, 'categories', formData.category);
        const currencyRef = doc(firestore, 'currencies', formData.currency);
        const transaction = {
            sum: formData.type === 'income' ? parseFloat(formData.sum) : -parseFloat(formData.sum),
            category: categoryRef,
            currency: currencyRef,
            from: formData.from,
            date: new Date(formData.date)
        }
        await addDoc(collection(firestore,  'transactions'), transaction);
        setModal(false);
    }

    const close = () => {
        setModal(false);
    }

    const changeData = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    return (
        <ReactModal 
            isOpen={isOpen}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel="Add Transaction"
            onRequestClose={close}
            ariaHideApp={true}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            shouldReturnFocusAfterClose={true}
        >
            <h1 className={styles.heading}>Add transaction</h1>
            <form className={styles.form} onSubmit={addTransaction}>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Type</legend>
                    <label>Income: <input type="radio" name="type" className={styles.fieldsetRadio} checked={formData.type === 'income'} value="income" onChange={changeData}/></label>
                    <label>Expense: <input type="radio" name="type" className={styles.fieldsetRadio} checked={formData.type === 'expense'} value="expense" onChange={changeData}/></label>
                </fieldset>
                <label className={styles.label}>
                    <span className={styles.title}>Sum:</span>
                    <input type="number" className={styles.control} value={formData.sum} name="sum" onChange={changeData} step="0.01" min="0.01" required/>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Category:</span>
                    <select className={`${styles.control} ${styles.select}`} value={formData.category} name="category" onChange={changeData}>
                        {categories.map((category, i) => <option key={i} value={category.id}>{category.name}</option>)}
                    </select>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Currency:</span>
                    <select className={styles.control} value={formData.currency} name="currency" onChange={changeData}>
                        {currencies.map((currency, i) => <option key={i} value={`${currency.id}`}>{`${currency.data.symbol}  ${currency.data.name}`}</option>)}
                    </select>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>From:</span>
                    <input type="text" className={styles.control} value={formData.from} onChange={changeData} name="from" required/>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Date:</span>
                    <input type="date" className={styles.control} value={formData.date} onChange={changeData} name="date" />
                </label>
                <div className={styles.btnGroup}>
                    <button className={`${styles.btn} ${styles.closeBtn}`} onClick={close}>Cancel</button>
                    <button className={`${styles.btn} ${styles.addBtn}`} onClick={addTransaction}>Add</button>
                </div>
                
            </form>
        </ReactModal>
    )
}

export default AddTransactionModal;