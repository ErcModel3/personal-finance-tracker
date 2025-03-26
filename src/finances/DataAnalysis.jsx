import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto';

// Import Components
import styles from "../Styles.module.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Import Reports
import BudgetPieChart from "../finance_modules/BudgetPieChart.jsx";
import SpendingCategoryPieChart from "../finance_modules/SpendingCategoryPieChart.jsx";
import SpendingMonthlyBarChart from "../finance_modules/SpendingMonthlyBarChart.jsx";

Chart.register(ArcElement, Tooltip, Legend);

const DataAnalysis = () => {

    // Sample data (TO REPLACE with db entries)
    const MoneySpentMonthly = [122, 635, 539, 860, 841, 526, 535, 440, 930, 839, 420, 78];

    const budgetData = {
        monthlySalary: 5000,
        tax: 1250,
        amountSpent: 2800,
        bonus: 500,
        budgetSet: 3000,
        grossSalary: 6250
    };

    return (
        <div className={styles.app}>
            <Navbar />
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Budget Report</h1>
                    <p className={styles.heroDescription}>Details of your net income after deductions.</p>
                    <button className={styles.primaryButton}>Download Report</button>
                </div>
            </div>

            {/*Financial breakdown components*/}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Financial Summary</h2>
                    <p className={styles.metricsDescription}>Your financial metrics at a glance</p>
                </div>

                <div className={styles.metricsCards}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Monthly Salary</div>
                        <div className={styles.metricValue}>£{budgetData.monthlySalary}</div>
                        <div>- Tax: £{budgetData.tax}</div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Amount Spent</div>
                        <div className={styles.metricValue}>£{budgetData.amountSpent}</div>
                        <div>+ Bonus: £{budgetData.bonus}</div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Budget Set</div>
                        <div className={styles.metricValue}>£{budgetData.budgetSet}</div>
                        <div>from Gross Salary</div>
                    </div>
                </div>
            </div>

            {/*Pie chart bit*/}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending Overview</h2>
                    <p className={styles.metricsDescription}>How much money you've spent, at a glance</p>
                </div>
                <div className={styles.chartContainer}>
                    <BudgetPieChart budgetData={budgetData} />
                </div>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending Per Category</h2>
                    <p className={styles.metricsDescription}>How much money you've spent, broken down</p>
                </div>
                <div className={styles.chartContainer}>
                    <SpendingCategoryPieChart budgetData={budgetData} />
                </div>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending Per Month</h2>
                    <p className={styles.metricsDescription}>How much money you've spent per month, broken down</p>
                </div>
                <div className={styles.chartContainer}>
                    <SpendingMonthlyBarChart MoneySpentMonthly ={MoneySpentMonthly} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DataAnalysis;