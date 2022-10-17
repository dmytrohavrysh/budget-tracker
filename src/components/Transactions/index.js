import { lazy, Suspense, useContext, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import styles from "./Transactions.module.css";
import Transaction from "../Transaction/index"
import DateSelector from '../DateSelector';
import { getTransactions, addTransaction } from '../../providers/services/Storage';
import useModal from '../../hooks/useModal';
import { Loader } from '../Loader';
import { Error } from '../Error';
import { useAuth } from '../../hooks/useAuth';
import { SettingsContext } from '../../providers/context/Settings';
const AddTransactionModal = lazy(() => import('../../components/AddTransactionModal'));


const Transactions = () => {
    const {currUser} = useAuth();
    const {settingsState} = useContext(SettingsContext);
    const [isModalOpen, openModal, closeModal, isLocked ] = useModal();
    const queryClient = useQueryClient()
    const [date, setDate] = useState({year: new Date().getFullYear(), month: new Date().getMonth()});
    const transactions = useQuery(['transactions', date], async() => await getTransactions(date.year, date.month, currUser?.email), {
        networkMode: 'offlineFirst',
        placeholderData: [],
        onError: e => console.log(e)
    });
    
    const mutateData = useMutation(newTransaction => {
        addTransaction(newTransaction, currUser.email);
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
            
            <button className={`${styles.add} btn`} onClick={openModal}>Add Transaction</button>
            <div className={styles.total}>
                <h3 className={styles.total__heading}>Total:</h3>
                <p className={styles.total__sum}>{Math.round(transactions?.data?.reduce((acc, next) => acc + next.sum, 0)*100) / 100} {settingsState.currency}</p>
            </div>
        
        { transactions.isLoading || transactions.fetchStatus === 'fetching'? 
            <Loader />
            : transactions.isError?
                <Error>I can't load transactions...</Error>
            : 
            <>
                <div className={styles.transactions}>
                {transactions?.data?.map((data, i) => <Transaction key={i} sum={data.sum} category={data.category} currency={data.currency} from={data.from} date={data.date}/>)}
                </div>
                
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