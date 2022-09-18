import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/index";
import Account from "../../pages/Account/index";
import Statistic from "../../pages/Statistic/index";
import NotFound from "../../pages/NotFound/index";
import Header from "../Header/index";
import Login from "../../pages/Login";
import PrivateRoute from "../PrivateRoute";
import Welcome from "../../pages/Welcome";

const App = () => {
    
    return (
        <Router basename='/'>
              <Header />
              <div className="wrapper">
                  <Routes>
                    <Route exact path='/welcome' element={<Welcome/>} />
                    <Route exact path='/account' element={<PrivateRoute/>}>
                        <Route exact path="/account" element={<Account />} />
                    </Route>
                    <Route exact path="/statistic" element={<PrivateRoute />}>
                        <Route path="/statistic" element={<Statistic />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route exact path='/' element={<PrivateRoute/>}> 
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
              </div>
        </Router>
        )
        
    }
    
    export default App;