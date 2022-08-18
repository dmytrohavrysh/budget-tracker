import { useState, useEffect, useContext } from 'react';
import ReactModal from 'react-modal';
import styles from './AddTransactionModal.module.css';
import { CategoriesContext } from '../../providers/context/Categories';
import { CurrenciesContext } from '../../providers/context/Currencies';
import { TransactionsContext } from '../../providers/context/Transactions';

const formatDate = (date) => {
    const d = new Date(date);
    let month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = d.getDate();
    day = day < 10 ? '0' + day : day;
    const year = d.getFullYear();
    let hours = d.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = d.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const AddTransactionModal = ({isOpen, setModal}) => {    
    const {transactionsState, dispatchTransactions} = useContext(TransactionsContext);
    const {categoriesState, dispatchCategories} = useContext(CategoriesContext);
    const {currenciesState, dispatchCurrencies} = useContext(CurrenciesContext);
    const [formData, setFormData] = useState({
        type: 'expense',
        category: categoriesState.length > 0 ? categoriesState[0].name: '',
        sum: 0.01,
        currency: currenciesState.length > 0 ? currenciesState[0].name: '',
        from: 'Me',
        date: new Date()
    });
   

    const addTransaction = async (e) => {
        e.preventDefault();
        dispatchTransactions({type: 'addTransaction', payload: {...formData}});
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
                    <select className={`${styles.control} ${styles.select}`} name="category" onChange={changeData}>
                        {categoriesState.map((category, i) => <option key={i} value={category.id}>{category.name}</option>)}
                    </select>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Currency:</span>
                    <select className={styles.control} name="currency" onChange={changeData}>
                        {currenciesState.map((currency, i) => <option key={i} value={`${currency.id}`}>{`${currency.symbol}  ${currency.name}`}</option>)}
                    </select>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>From:</span>
                    <input type="text" className={styles.control} value={formData.from} onChange={changeData} name="from" required/>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Date:</span>
                    <input type="datetime-local" className={styles.control} value={formatDate(formData.date)} onChange={changeData} name="date"/>
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