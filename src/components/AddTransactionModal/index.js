import { useState} from 'react';
import styles from './AddTransactionModal.module.css';
import { getCategories } from '../../providers/services/Storage';
import { useQuery } from '@tanstack/react-query';
import Modal from '../Modal';

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

const AddTransactionModal = ({addTransaction: addTransactionLocal, isModalOpen, closeModal, isLocked}) => {
    const categories = useQuery(['categories'], async () => {
        const cats = await getCategories();
        if (cats?.length > 0) {
            setFormData({...formData, category: cats[0].name})
        }
        return cats;
    });

    const [formData, setFormData] = useState({
        type: 'expense',
        category: categories.length > 0 ? categories[0].name: '',
        sum: 1.00,
        from: 'Me',
        date: new Date()
    });
   

    const addTransaction = async (e) => {
        e.preventDefault();
        addTransactionLocal(formData);
        closeModal();
    }

    const updateData = (e) => {
        setFormData({...formData, [e.target.name]: FLOAT_NUMBER_REGEX.test(e.target.value) ? +e.target.value : e.target.value});
    }

    return (
        <Modal open={isModalOpen} dataLoaded={categories.isFetched} onClose={closeModal} locked={isLocked}>
            <h1 className={styles.heading}>Add transaction</h1>
            <form className={styles.form} onSubmit={addTransaction}>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Type</legend>
                    <label>Income: <input type="radio" name="type" className={styles.fieldsetRadio} checked={formData.type === 'income'} value="income" onChange={updateData}/></label>
                    <label>Expense: <input type="radio" name="type" className={styles.fieldsetRadio} checked={formData.type === 'expense'} value="expense" onChange={updateData}/></label>
                </fieldset>
                <label className={styles.label}>
                    <span className={styles.title}>Sum:</span>
                    <input type="number" className={styles.control} defaultValue={formData.sum} name="sum" onChange={updateData} step="0.01" min="0.01" required/>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Category:</span>
                    <select className={`${styles.control} ${styles.select}`} name="category" defaultValue={formData.category} onChange={updateData}>
                        {categories?.data?.map((category, i) => <option key={i} value={category.id}>{category.name}</option>)}
                    </select>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>From:</span>
                    <input type="text" className={styles.control} value={formData.from} onChange={updateData} name="from" required/>
                </label>
                <label className={styles.label}>
                    <span className={styles.title}>Date:</span>
                    <input type="datetime-local" className={styles.control} defaultValue={formatDate(formData.date)} onChange={updateData} name="date"/>
                </label>
                <div className={styles.btnGroup}>
                    <button className={`${styles.btn} ${styles.closeBtn}`} onClick={closeModal}>Cancel</button>
                    <button className={`${styles.btn} ${styles.addBtn}`} onClick={addTransaction}>Add</button>
                </div>
                
            </form>
        </Modal>
    )
}

export default AddTransactionModal;