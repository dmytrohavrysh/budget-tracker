import { useState } from 'react';
import styles from "./Transactions.module.css";
import Transaction from "../Transaction/index"
import AddTransactionModal from '../../components/AddTransactionModal';

const Transactions = ({transactions}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <div className={styles.transactions}>
                {transactions.map((data, i) => <Transaction key={i} sum={data.sum} category={data.category} currency={data.currency} from={data.from} date={data.date}/>)}
            </div>       
            <button className={styles.add} onClick={openModal}>Add Transaction</button>
            <AddTransactionModal isOpen={isModalOpen} setModal={setIsModalOpen}/>
        </>
    )
    
}

export default Transactions;