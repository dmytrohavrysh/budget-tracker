import { useState, useContext } from 'react';
import styles from './StatisticMonthView.module.css';
import { SettingsContext } from '../../providers/context/Settings';

function StatisticMonthView({originalTransactions, modTransactions}) {
    const [selectedCat, setSelectedCat] = useState(null)
    const {settingsState} = useContext(SettingsContext);

    const chooseCat = (category) => {
        if(selectedCat === category) {
            setSelectedCat(null)
            return
        }
        setSelectedCat(category)
    }

    return <>
        <div className={styles.categories}>
        {modTransactions?.map((el, i) => {
            return(<div key={i} className={`${styles.item} ${selectedCat===el[0] ? styles.item__active : ''}`} onClick={() => chooseCat(el[0])}>
                    <div className={styles.category}>{el[0]}</div>
                    <div className={styles.sum}>{el[1]} {settingsState.currency}</div>
                </div>)
            })
        }
        </div>
        {selectedCat && <>
         
        <h2 className={styles.details__heading}>{selectedCat}</h2>
        <div className={styles.details}>
         {      
            originalTransactions.filter(el => el.category === selectedCat).sort((a, b) => a.date - b.date).map(el => {
                return(<div className={styles.details__item} key={el.id}>
                    <div className={styles.details__date}>{el.date.toLocaleString()}</div>
                    <div className={styles.details__from}>{el.from}</div>
                    <div className={styles.details__sum}>{el.sum} {settingsState.currency}</div>
                </div>)
            })
        }
        </div>
        </>
        }        
    </>
}

export default StatisticMonthView; 