import { useState } from 'react';
import styles from './StatisticMonthView.module.css';

function StatisticMonthView({originalTransactions, modTransactions}) {
    const [selectedCat, setSelectedCat] = useState(null)

    const chooseCat = (category) => {
        if(selectedCat === category) {
            setSelectedCat(null)
            return
        }
        setSelectedCat(category)
    }

    return <>
        <div className={styles.categories}>
        {modTransactions?.map((el) => {
            return(<div key={el.id} className={`${styles.item} ${selectedCat===el.category ? styles.item__active : ''}`} onClick={() => chooseCat(el.category)}>
                    <div className={styles.category}>{el.category}</div>
                    <div className={styles.sum}>{el.sum}{el.currency.symbol}</div>
                </div>)
            })
        }
        </div>
        {selectedCat !== null &&
         
        <div className={styles.details}>
         {      
            originalTransactions.filter(el => el.category === selectedCat).sort((a, b) => a.date - b.date).map(el => {
                return(<div className={styles.details__item} key={el.id}>
                    <div className={styles.details__date}>{el.date.toLocaleString()}</div>
                    <div className={styles.details__from}>{el.from}</div>
                    <div className={styles.details__sum}>{el.sum}</div>
                </div>)
            })
        }
        </div>
        }        
    </>
}

export default StatisticMonthView; 