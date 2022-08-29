import StatisticChartView from '../../components/StatisticChartView'

const NotFound = () => {
    const originalTransactions = [{
        category: 'salary',
        sum: 3000,
        from: 'Test',
        date: new Date()
    },{
        category: 'clothes',
        sum: -1000,
        from: 'Test',
        date: new Date()
    }]
    const modTransactions = [['salary', 3000], ['clothes', -1000]]

    return (
        <div>
            <StatisticChartView originalTransactions={originalTransactions} modTransactions={modTransactions}></StatisticChartView>
        </div>
    );
}

export default NotFound;