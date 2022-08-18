import { lazy, Suspense, useEffect, useState, useContext, useRef } from 'react';
import styles from "./Transactions.module.css";
import Transaction from "../Transaction/index"
import { TransactionsContext } from '../../providers/context/Transactions';
import ReactModal from 'react-modal';
import DateSelector from '../DateSelector';
const AddTransactionModal = lazy(() => import('../../components/AddTransactionModal')) ;

const Transactions = () => {
    const {transactionsState, dispatchTransactions} = useContext(TransactionsContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Disable the content when the modal is open
    useEffect(() => {
        ReactModal.setAppElement('#root');
    }, []);

    const openModal = () => setIsModalOpen(true);

    const changedDate = async () => {
        await dispatchTransactions({type: 'updateTransactions'});
    }

    return (
        <>
            <DateSelector changedDate={changedDate} />
            <div className={styles.transactions}>
                {transactionsState.map((data, i) => <Transaction key={i} sum={data.sum} category={data.category} currency={data.currency} from={data.from} date={data.date}/>)}
            </div>       
            <button className={styles.add} onClick={openModal}>Add Transaction</button>

            {isModalOpen && 
            <Suspense>
                <AddTransactionModal isOpen={isModalOpen} setModal={setIsModalOpen}/>
            </Suspense>}

        </>
    )
    
}

export default Transactions;