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
    const [date1, setDate1] = useState({month: month1, year: year1})
    const [date2, setDate2] = useState({month: month2, year: year2})
    const [originalTransactions1, setOriginalTransactions1] = useState([]);
    const [originalTransactions2, setOriginalTransactions2] = useState([]);
    const [modTransactions1, setModTransactions1] = useState([]);
    const [modTransactions2, setModTransactions2] = useState([]);
    const [isDataProcessed, setDataProcessed] = useState(false);
    
    const leftTransactions = useQuery([`statistic-month-${date1.month}-${year1.year}`], async () => {
        const leftTransactions = await getTransactions(date1.year, date1.month);
        return leftTransactions;
    }, {
        placeholderData: [],    
        onSuccess: () => {
        },
        onError: () => console.log('error')
    });
    
    const rightTransactions = useQuery([`statistic-month-${date2.month}-${date2.year}`], async () => {
        const rightTransactions = await getTransactions(date2.year, date2.month);
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

    const changeDate = (e) => {
        const year = +e.target.value.slice(0, 4);
        const month = +e.target.value.slice(6) - 1;
        const location = e.target.dataset.location;
        if(location === 'left') {
            setDate1({year, month});
        } else {
            setDate2({year, month});
        }
    }

    function processCategories() {
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
                newTransactions1.push(categories1.find(val => val[0] === cat));
            });
            [...commonCategories, ...rightCategoriesOnly].forEach(cat => {
                newTransactions2.push(categories2.find(val => val[0] === cat));
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
                    
                    <input type="month" data-location="left" className={styles.comparator__month} pattern="[0-9]{4}-[0-9]{2}" onChange={changeDate} defaultValue={`${date1.year}-${(date1.month+1) > 9 ? date1.month+1 : '0'+(date1.month+1)}`}/>
                    
                    <div className={styles.comparator__body}> 
                        <StatisticMonthView originalTransactions={originalTransactions1} modTransactions={modTransactions1}/>
                    </div>  
                </div> 
            
                <div className={styles.right}>
                    <input type="month" data-location="right" className={styles.comparator__month} pattern="[0-9]{4}-[0-9]{2}" onChange={changeDate} defaultValue={`${date2.year}-${(date2.month+1) > 9 ? date2.month+1 : '0'+(date2.month+1)}`}/>
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