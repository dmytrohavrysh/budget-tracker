import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/index";
import Account from "../../pages/Account/index";
import Statistic from "../../pages/Statistic/index";
import NotFound from "../../pages/NotFound/index";
import Header from "../Header/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })

const App = () => {
    
    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <Header />
                <div className="wrapper">
                    <Routes>
                        <Route path="/account" element={<Account />} />
                        <Route path="/statistic" element={<Statistic />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <ReactQueryDevtools initialIsOpen={true}/>
            </QueryClientProvider>
        </Router>
        )
        
    }
    
    export default App;