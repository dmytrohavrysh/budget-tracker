// TODO:
// - Compare and Statistic modes
// Compare:
// - Compare two budgets by categories
// - Click on a category to see expenses and incomes
// - Months to compare can be selected
import StatisticMonthComparator from '../../components/StatisticMonthComparator';

const Statistic = () => {
    
    return (<>
        <StatisticMonthComparator year1={2022} month1={6} year2={2022} month2={5}/>
        </>
    );
}

export default Statistic;