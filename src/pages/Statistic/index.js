import { Error } from '../../components/Error';
import StatisticMonthComparator from '../../components/StatisticMonthComparator';
import { useAuth } from '../../hooks/useAuth';

const Statistic = () => {
    const currDate = new Date();
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth();
    const {currUser} = useAuth();
    const prevYear = currMonth > 0 ? currYear : currYear - 1;
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    return (<>
            {currUser?.emailVerified ?
            <StatisticMonthComparator year1={currYear} month1={currMonth} year2={prevYear} month2={prevMonth}/>
            : <Error>To use this application you must verify your email</Error>
            }
        </>
    );
}

export default Statistic;