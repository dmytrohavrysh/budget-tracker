// TODO:
// - Compare and Statistic modes
// Compare:
// - Compare two budgets by categories
// - Click on a category to see expenses and incomes
// - Months to compare can be selected
import StatisticMonthComparator from '../../components/StatisticMonthComparator';

const Statistic = () => {
    const currDate = new Date();
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth();
    const prevYear = currMonth > 0 ? currYear : currYear - 1;
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    return (<>
        <StatisticMonthComparator year1={currYear} month1={currMonth} year2={prevYear} month2={prevMonth}/>
        </>
    );
}

export default Statistic;