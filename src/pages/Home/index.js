import Transactions from '../../components/Transactions';
import ErrorBoundary from '../../components/ErrorBoundary';

const Home = ({transactions}) => {

    return (
        <ErrorBoundary>
            <Transactions transactions={transactions}/>
        </ErrorBoundary>
    )
}

export default Home;