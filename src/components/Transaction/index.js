import {useContext, memo} from 'react';
import PropTypes from 'prop-types';
import { SettingsContext } from '../../providers/context/Settings';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './Transaction.module.css';
import categoryIcons from '../../fontawesome-icons-map';

const parseDate = (date, locale) => {
    const year = date.getFullYear();
    const formatter = new Intl.DateTimeFormat(locale, {month: 'long'});
    const month = formatter.format(new Date(year, date.getMonth()));
    const day = date.getDate();
    const time = date.toTimeString().split(' ')[0];
    return {day, month, year, time};
}

const Transaction = ({sum, from, category, currency, date}) => {
    const {settingsState} = useContext(SettingsContext);
    const parsedDate = parseDate(date, settingsState.locale);
    return (
        <div className={styles.transaction}>
            <div className={styles.date}>{parsedDate.day} {parsedDate.month} {parsedDate.year} {parsedDate.time}</div>
            {/* <div className={styles.category}>{category}</div> */}
            <div className={styles.category}><FontAwesomeIcon className={styles.icon} icon={categoryIcons[category]} />{category}</div>
            <div className={styles.from}>{from}</div>
            <div className={`${styles.sum} ${sum > 0 ? styles.income : styles.expense}`}>{sum} {currency.symbol}</div>
        </div>
    )
}

Transaction.propTypes = {
    // date: PropTypes.object,
    sum: PropTypes.number,
    from: PropTypes.string,
    category: PropTypes.string
}
 export default memo(Transaction);