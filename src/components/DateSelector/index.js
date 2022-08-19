import { useState, useContext, useEffect, useRef } from 'react';
import styles from './DateSelector.module.css';
import { SettingsContext } from '../../providers/context/Settings';

function getMonthList(locales) {
    const format = 'long';
    const year = new Date().getFullYear();
    const monthList = [...Array(12).keys()];
    const formatter = new Intl.DateTimeFormat(locales, {
      month: format
    });
  
    const getMonthName = (monthIndex) => {
        const month = formatter.format(new Date(year, monthIndex));
        return {'name': month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(), 'index': monthIndex};
    }      
    return monthList.map(getMonthName).reverse();
}

const DateSelector = ({changedDate}) => {
    const [years, setYears] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const {settingsState, dispatchSettings} = useContext(SettingsContext);

    const allMonths = getMonthList(settingsState.locale);
    const yearRef = useRef(null);
    const monthRef = useRef(null);

    useEffect(() => {
        const year = new Date().getFullYear();
        setYears([year, year - 1, year - 2]);
        const currentMonth = new Date().getMonth();
        setMonthList(allMonths.slice(11 - currentMonth));
    }, [])

    const changeDate = () => {
        const year = +yearRef.current.value;
        const month = +monthRef.current.value;
        changedDate({year, month});
    }
    const changeSelectedDate = () => {
        const year = +yearRef.current.value;
        const month = +monthRef.current.value;
        setSelectedYear(year);
        setSelectedMonth(month);
    }
    
    const updateMonthList = (e) => {
        const year = e.target.value;
        const currentYear = new Date().getFullYear();
        if(year < currentYear) {
            setMonthList(allMonths.slice());
        } else {
            const currentMonth = new Date().getMonth();
            setMonthList(allMonths.slice(11 - currentMonth));
        }
    }

    return (
        <fieldset className={styles.changeDate}>
            <legend className={styles.legend}>Choose period:</legend>
            <label htmlFor='month' className={styles.label}>Month:</label>
            <select id='month' className={styles.select} ref={monthRef} value={selectedMonth} onChange={changeSelectedDate}>
                {monthList.map((month) => <option key={month.index} value={month.index}>{month.name}</option>)}
            </select>
            <label htmlFor='year' className={styles.label}>Year:</label>
            <select id='year' onChange={(e) => {updateMonthList(e); changeSelectedDate()}} className={styles.select} ref={yearRef} value={selectedYear}>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            <button onClick={changeDate} className={styles.okBtn}>Ok</button>
        </fieldset>
    );
    
}

export default DateSelector;