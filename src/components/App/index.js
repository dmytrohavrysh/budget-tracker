import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/index";
import Account from "../../pages/Account/index";
import Statistic from "../../pages/Statistic/index";
import NotFound from "../../pages/NotFound/index";
import Header from "../Header/index";
import AddTransactionModal from "../AddTransactionModal/index";
import { collection, getDocs, getDoc } from "firebase/firestore";
import {firestore} from "../../firebase";
import { useEffect, useState } from "react";

const App = () => {
    const [transactions, setTransactions] = useState([]);
    const transactionsCollection = collection(firestore, "transactions");
    
    useEffect(() => {
        (async () => {
            let transactionsSnapshot;
            try {
                transactionsSnapshot = (await getDocs(transactionsCollection))?.docs;
            } catch (error) {
                console.log('Error getting transactions: ', error);
                return;
            }
            const temp = [];
            for(const doc of transactionsSnapshot) {
                const data = doc.data();
                const category = (await getDoc(data.category));
                const currency = (await getDoc(data.currency));
                const transaction = {
                    sum: data.sum,
                    from: data.from,
                    category: category.data().name,
                    categoryId: category.id,
                    currency: currency.data(),
                    currencyId: currency.id,
                    date: new Date(data.date.seconds*1000)
                }
                temp.push(transaction);
            }
            setTransactions(temp);
            
        })();
    }, []);

    
    return (
        <>
            <Router> 
                <Header />
                <div className="wrapper">
                    <Routes>
                        <Route path="/addTransaction" element={<AddTransactionModal />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/statistic" element={<Statistic />} />
                        <Route path="/" element={<Home transactions={transactions}/>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </>
    )
    
  }

  export default App;