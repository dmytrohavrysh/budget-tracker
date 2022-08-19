import { useState} from 'react';
import ReactModal from 'react-modal';
import styles from './AddTransactionModal.module.css';
import { categoriesService } from '../../providers/services/FirestoreService';
import { currenciesService } from '../../providers/services/FirestoreService';
import { useQuery } from '@tanstack/react-query';

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

const FLOAT_NUMBER_REGEX = /^[\+\-]?([0-9]*\.)?[0-9]+$/;

const AddTransactionModal = ({isOpen, setModal, addTransaction: addTransactionLocal}) => {
    const categories = useQuery('categories', categoriesService.getCategories);
    const currencies = useQuery('currencies', currenciesService.getCurrencies);

    const [formData, setFormData] = useState({
        type: 'expense',
        category: categories.length > 0 ? categories[0].name: '',
        sum: 1.00,
        currency: currencies.length > 0 ? currencies[0].name: '',
        from: 'Me',
        date: new Date()
    });
   

    const addTransaction = async (e) => {
        e.preventDefault();
        addTransactionLocal(formData);
        setModal(false);
    }

    const close = () => {
        setModal(false);
    }

    const updateData = (e) => {
        setFormData({...formData, [e.target.name]: FLOAT_NUMBER_REGEX.test(e.target.value) ? +e.target.value : e.target.value});
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
                    <label>Income: <input type="radio" name="type" className={styles.fieldsetRadio} checked={formData.type === 'income'} value="income" onChange={updateData}/></label>
                    <label>Expense: <input type="radio" name="type" className={styles.fieldsetRadio} checked={formData.type === 'expense'} value="expense" onChange={updateData}/></label>
                </fieldset>
                <label className={styles.label}>
                    <span className={styles.title}>Sum:</span>
                    <input type="number" className={styles.control} value={formData.sum} name="sum" onChange={updateData} step="0.01" min="0.01" required/>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Category:</span>
                    <select className={`${styles.control} ${styles.select}`} name="category" onChange={updateData}>
                        {categories?.data?.map((category, i) => <option key={i} value={category.id}>{category.name}</option>)}
                    </select>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Currency:</span>
                    <select className={styles.control} name="currency" onChange={updateData}>
                        {currencies?.data?.map((currency, i) => <option key={i} value={`${currency.id}`}>{`${currency.symbol}  ${currency.name}`}</option>)}
                    </select>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>From:</span>
                    <input type="text" className={styles.control} value={formData.from} onChange={updateData} name="from" required/>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Date:</span>
                    <input type="datetime-local" className={styles.control} value={formatDate(formData.date)} onChange={updateData} name="date"/>
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