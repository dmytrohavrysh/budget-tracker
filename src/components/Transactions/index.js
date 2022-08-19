import { lazy, Suspense, useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import styles from "./Transactions.module.css";
import Transaction from "../Transaction/index"
import ReactModal from 'react-modal';
import DateSelector from '../DateSelector';
import { getTransactions, addTransaction } from '../../providers/services/Storage';
const AddTransactionModal = lazy(() => import('../../components/AddTransactionModal')) ;

const Transactions = () => {
    const queryClient = useQueryClient()
    const [date, setDate] = useState({year: new Date().getFullYear(), month: new Date().getMonth()});
    const transactions = useQuery(['transactions', date], async() => await getTransactions(date.year, date.month), {
        networkMode: 'offlineFirst',
        networkMode: 'offlineFirst',
        placeholderData: []
    });
    
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Disable the content when the modal is open
    useEffect(() => {
        ReactModal.setAppElement('#root');
    }, []);
    
    const openModal = () => setIsModalOpen(true);
    
    const mutateData = useMutation(newTransaction => {
        addTransaction(newTransaction);
    }, {
        onMutate: async newTransaction => {
            await queryClient.cancelQueries(['transactions'])
            const previousTodos = queryClient.getQueryData(['transactions'])
            queryClient.setQueryData(['transactions'], old => [...old, newTransaction])
            return { previousTodos }
        },
        onError: (err, newTransaction, context) => {
            queryClient.setQueryData(['transactions'], context.previousTodos)
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['transactions'], refetchActive: false})
        },
    })
    
    const changedDate = async (date) => {
        setDate(date);
    }
    
    const changedData = (newTransaction) => {
        mutateData.mutateAsync(newTransaction);
    }
    
    
    return (
        <>
        <DateSelector changedDate={changedDate} />
        
        { transactions.isLoading || transactions.fetchStatus === 'fetching'? 
            <div className={styles.loader}></div>
            : transactions.isError?
            <>  
                <div className={styles.errorSmile}></div>
                <h2 className={styles.errorText}>I can't load transactions...</h2>
            </>
            : 
            <>
                <div className={styles.transactions}>
                {transactions?.data?.map((data, i) => <Transaction key={i} sum={data.sum} category={data.category} currency={data.currency} from={data.from} date={data.date}/>)}
                </div>
                <button className={styles.add} onClick={openModal}>Add Transaction</button>
            </>
        }
        {isModalOpen && 
            <Suspense>
            <AddTransactionModal isOpen={isModalOpen} setModal={setIsModalOpen} addTransaction={changedData}/>
            </Suspense>}
            
            </>
            )
            
        }
        
        export default Transactions;