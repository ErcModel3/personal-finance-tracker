import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto';

import styles from "../Styles.module.css";
import BudgetPieChart from "../components/BudgetPieChart.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

Chart.register(ArcElement, Tooltip, Legend);

const DataAnalysis = () => {

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
                    <p className={styles.metricsDescription}>How much money you've spent at, a glance</p>
                </div>
                <div className={styles.chartContainer}>
                    <BudgetPieChart budgetData={budgetData} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DataAnalysis;