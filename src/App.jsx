import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from "./Styles.module.css";
import './App.css'

//Import components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import NotFound from "./components/PageNotFound.jsx";

//Import pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Wrapper from "./auth/Wrapper.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Reviews from "./pages/Reviews.jsx";
import Welcome from "./pages/Welcome.jsx";
import MonthlySpending from "./pages/WelcomePage.jsx";

//Import financial and associated changes
import Data from "./finances/DataAnalysis.jsx";
import BudgetPieChart from "./components/BudgetPieChart.jsx";

// Imports all graphics and other assets
import {ExpenseForm} from "./Features/ExpenseForm.jsx";

function Home() {
    // Sample data (TO REPLACE with db entry)
    const budgetData = {
        monthlySalary: 5000,
        tax: 1250,
        amountSpent: 2800,
        bonus: 500,
        budgetSet: 3000,
        grossSalary: 6250
    };

    return (
        <>
            <p className="read-the-docs">
            </p>
            <div>
                <Navbar/>
                <Welcome/>
                {/*<MonthlySpending/>*/}
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending Overview</h2>
                    <p className={styles.metricsDescription}>How much money you've spent at, a glance</p>
                </div>
                <div className={styles.chartContainer}>
                    <BudgetPieChart budgetData={budgetData} />
                </div>
                <Reviews/>
                <Footer/>
            </div>
        </>
    )

}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />}/>
                <Route path="/data" element={<Data/>}/>
                <Route path="/expenses" element={<ExpenseForm />} />
                <Route path="/dashboard" element={
                    <Wrapper>
                        <Dashboard />
                    </Wrapper>
                } />
                {/* Add more routes here */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;