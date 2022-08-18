import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/index";
import Account from "../../pages/Account/index";
import Statistic from "../../pages/Statistic/index";
import NotFound from "../../pages/NotFound/index";
import Header from "../Header/index";

const App = () => {
    
    return (
        <Router> 
            <Header />
            <div className="wrapper">
                <Routes>
                    <Route path="/account" element={<Account />} />
                    <Route path="/statistic" element={<Statistic />} />
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    )
    
  }

  export default App;