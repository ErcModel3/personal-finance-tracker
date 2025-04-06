import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from "./Styles.module.css";
import './App.css'
import NotificationPage from './pages/NotificationPage.jsx';

//Import components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import NotFound from "./components/NotFound.jsx";

//Import pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SessionWrapper from "./auth/SessionWrapper.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Reviews from "./pages/Reviews.jsx";
import Welcome from "./pages/Welcome.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";

//Import financial and associated changes
import Data from "./finances/DataAnalysis.jsx";
import BudgetPieChart from "./finance_modules/BudgetPieChart.jsx";
import SpendingMonthlyBarChart from "./finance_modules/SpendingMonthlyBarChart.jsx";
import AddExpense from "./finances/AddExpense.jsx";
import AddPaymentCard from "./finances/AddPaymentCard.jsx";
import ManagePaymentCards from "./finances/ManagePaymentCards.jsx"
import FinanceTargets from "./finances/FinanceTargets.jsx";

// Imports all graphics and other
import AccountInformation from "./Features/AccountDetailsComponents/AccountInformation.jsx";
import AccountDetail from "./Features/AccountDetailsComponents/AccountDetail.jsx";
import MergedCards from "./finances/MergedCards.jsx";

function Home() {
    // Sample data (TO REPLACE with db entry)
    const MoneySpentMonthly = [122, 635, 539, 40, 841, 526, 535, 440, 930, 839, 420, 78];
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
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending Per Month</h2>
                    <p className={styles.metricsDescription}>How much money you've spent per month, broken down</p>
                </div>
                <div className={styles.chartContainer}>
                    <SpendingMonthlyBarChart MoneySpentMonthly ={MoneySpentMonthly} />
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
                {/* Profile routing */}
                <Route path="/add-expense" element={
                    <SessionWrapper> <AddExpense /> </SessionWrapper>
                }/>
                <Route path="/finance-targets" element={
                    <SessionWrapper> <FinanceTargets /> </SessionWrapper>
                    } />
                <Route path="/data" element={<Data/>}/> {/* Needs to be renamed*/}
                <Route path="/manage-cards" element={
                    <SessionWrapper> <MergedCards /> </SessionWrapper>
                }/>
                <Route path="/notifications" element={
                    <SessionWrapper> <NotificationPage/> </SessionWrapper>
                }/>
                <Route path="/settings" element={
                    <SessionWrapper> <AccountInformation/> </SessionWrapper>
                }/>
                <Route path="/dashboard" element={
                    <SessionWrapper> <Dashboard /> </SessionWrapper>
                } />


                {/* Non profile Routing */}
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />}/>
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} /> 
                <Route path="/dashboard" element={<Dashboard />} />
                
                
                <Route path="/terms" element={<TermsConditions />} /> {/* Terms and Conditions route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;