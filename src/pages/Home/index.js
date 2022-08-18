import Transactions from '../../components/Transactions';
import ErrorBoundary from '../../components/ErrorBoundary';

const Home = () => {

    return (
        <ErrorBoundary>
            <Transactions />
        </ErrorBoundary>
    )
}

export default Home;