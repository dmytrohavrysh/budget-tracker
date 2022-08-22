import styles from './StatisticMonthComparator.module.css';
import { useState, useRef, useEffect } from 'react';
import {useQuery} from '@tanstack/react-query';
import {getTransactions} from '../../providers/services/Storage';
import { Loader } from '../Loader';
import { Error } from '../Error';
import StatisticMonthView from '../StatisticMonthView';

const groupBy = (transactions, key) => {
    return transactions.reduce((result, x) => {
        (result[x[key]] = result[x[key]] || []).push(x);
        return result;
    }, {});
};

const extractCategories = (transactions) => {
    const groupedData = groupBy(transactions, 'category');
    let result = []; 
    for(let key in groupedData) {
        result.push([key, groupedData[key].reduce((acc, cur) => acc + cur.sum, 0)]);
    }
    return result;
}

function StatisticMonthComparator({ month1, year1, month2, year2 }) {
    const [originalTransactions1, setOriginalTransactions1] = useState([]);
    const [originalTransactions2, setOriginalTransactions2] = useState([]);
    const [modTransactions1, setModTransactions1] = useState([]);
    const [modTransactions2, setModTransactions2] = useState([]);
    const [isDataProcessed, setDataProcessed] = useState(false);
    
    const leftTransactions = useQuery([`statistic-month-${month1}-${year1}`], async () => {
        console.log('Update 1...');
        const leftTransactions = await getTransactions(year1, month1);
        return leftTransactions;
    }, {
        placeholderData: [],    
        onSuccess: () => {
        },
        onError: () => console.log('error')
    });
    
    const rightTransactions = useQuery([`statistic-month-${month2}-${year2}`], async () => {
        console.log('Update 2...');
        const rightTransactions = await getTransactions(year2, month2);
        return rightTransactions;
    }, {
        placeholderData: [],
        onSuccess: () => {
        },
        onError: () => console.log('error')
    });

    useEffect(() => {
        processCategories()
    }, [leftTransactions.data, rightTransactions.data])

    
    function processCategories() {
        console.log('Cats...');
        if(leftTransactions.isSuccess && leftTransactions.isFetched && rightTransactions.isSuccess && rightTransactions.isFetched) {
            setOriginalTransactions1(leftTransactions.data);
            setOriginalTransactions2(rightTransactions.data);
            const categories1 = extractCategories(leftTransactions.data);
            const categories2 = extractCategories(rightTransactions.data);
            const leftCategories = categories1.reduce((cats, val) => {cats.push(val[0]);return cats}, [])
            const rightCategories = categories2.reduce((cats, val) => {cats.push(val[0]);return cats}, [])
            const commonCategories = leftCategories.filter(cat => rightCategories.includes(cat));
            const leftCategoriesOnly = leftCategories.filter(cat => !commonCategories.includes(cat));
            const rightCategoriesOnly = rightCategories.filter(cat => !commonCategories.includes(cat));
            let newTransactions1 = [];
            let newTransactions2 = [];   
            
            [...commonCategories, ...leftCategoriesOnly].forEach(cat => {
                newTransactions1.push(leftTransactions.data.find(val => val.category === cat));
            });
            [...commonCategories, ...rightCategoriesOnly].forEach(cat => {
                newTransactions2.push(rightTransactions.data.find(val => val.category === cat));
            }); 
            setModTransactions1(newTransactions1);
            setModTransactions2(newTransactions2);
            setDataProcessed(true);
        }
    }
    
    return ( 
        <div className={styles.comparator}>
        {isDataProcessed ? 
            <>
                <div className={styles.left}>
                    <input type="month" className={styles.comparator__month} pattern="[0-9]{4}-[0-9]{2}" defaultValue={`${year1}-${(month1+1) > 9 ? month1+1 : '0'+(month1+1)}`}/>
                    <div className={styles.comparator__body}> 
                        <StatisticMonthView originalTransactions={originalTransactions1} modTransactions={modTransactions1}/>
                    </div>  
                </div> 
            
                <div className={styles.right}>
                    <input type="month" className={styles.comparator__month} pattern="[0-9]{4}-[0-9]{2}" defaultValue={`${year2}-${(month2+1) > 9 ? month2+1 : '0'+(month2+1)}`}/>
                    <div className={styles.comparator__body}> 
                        <StatisticMonthView originalTransactions={originalTransactions2} modTransactions={modTransactions2} />
                    </div>
                </div>
            </>
            : null}
        </div>
        );
    }
    export default StatisticMonthComparator;