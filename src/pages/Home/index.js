import Transactions from '../../components/Transactions';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAuth } from '../../hooks/useAuth';
import { Error } from '../../components/Error';

const Home = () => {
    const {currUser} = useAuth();
    return (
        <ErrorBoundary>
            {currUser?.emailVerified ?
            <Transactions />
            : <Error>To use this application you must verify your email</Error>
            }
            
        </ErrorBoundary>
    )
}

export default Home;