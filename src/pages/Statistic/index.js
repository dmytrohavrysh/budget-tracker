import { useEffect } from 'react';
import { init } from '../../providers/services/Storage';

const Statistic = () => {
    useEffect(() => {
        init()
    }, []);
    
    return (
        <div>
        <h1>Statistic</h1>
        </div>
    );
}

export default Statistic;