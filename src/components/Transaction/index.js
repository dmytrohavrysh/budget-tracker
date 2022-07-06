import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './Transaction.module.css';
import categoryIcons from '../../fontawesome-icons-map';

const Transaction = ({sum, from, category, currency, date}) => {
    return (
        <div className={styles.transaction}>
            <div className={styles.date}>{date.toLocaleDateString() }</div>
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
    category: PropTypes.oneOfType([])
}
 export default Transaction;