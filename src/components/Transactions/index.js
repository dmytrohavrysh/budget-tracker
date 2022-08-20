import { lazy, Suspense, useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import styles from "./Transactions.module.css";
import Transaction from "../Transaction/index"
import DateSelector from '../DateSelector';
import { getTransactions, addTransaction } from '../../providers/services/Storage';
import useModal from '../../hooks/useModal';
import { Loader } from '../Loader';
const AddTransactionModal = lazy(() => import('../../components/AddTransactionModal'));

const Transactions = () => {
    const [isModalOpen, openModal, closeModal, isLocked ] = useModal();
    const queryClient = useQueryClient()
    const [date, setDate] = useState({year: new Date().getFullYear(), month: new Date().getMonth()});
    const transactions = useQuery(['transactions', date], async() => await getTransactions(date.year, date.month), {
        networkMode: 'offlineFirst',
        networkMode: 'offlineFirst',
        placeholderData: []
    });
    
    const mutateData = useMutation(newTransaction => {
        addTransaction(newTransaction);
    }, {
        onMutate: async newTransaction => {
            await queryClient.cancelQueries(['transactions'])
            const previousTransactions = queryClient.getQueryData({queryKey: 'transactions'})
            queryClient.setQueryData({queryKey: 'transactions', updater: old => [...old, newTransaction]})
            return { previousTransactions }
        },
        onError: (err, newTransaction, context) => {
            debugger
            queryClient.setQueryData('transactions', context.previousTransactions)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['transactions'])
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
            <Loader />
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

            {isModalOpen ?
                <Suspense>
                    <AddTransactionModal addTransaction={changedData} isModalOpen={isModalOpen} closeModal={closeModal} isLocked={isLocked}/>
                </Suspense>
            : ''
            }
            
            </>
            )
            
        }
        
        export default Transactions;