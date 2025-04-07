import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../Styles.module.css";

// Import Components
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

// Import Charts
import BudgetPieChart from "../finance_modules/BudgetPieChart.jsx";
import SpendingCategoryPieChart from "../finance_modules/SpendingCategoryCharts.jsx";

const Dashboard = () => {
    // Sample data (TO DO replace with DB entries)
    const budgetData = {
        monthlySalary: 5000,
        tax: 1250,
        amountSpent: 2800,
        bonus: 500,
        budgetSet: 3000,
        grossSalary: 6250
    };
    
    const SpendingCategoryData = {
        "Bills":"30",
        "Eating out":"254",
        "Essential Spend":"132",
        "Groceries":"95",
        "Non-essential Spend":"45",
        "Shopping":"64",
        "Savings":"150"
    };

    // Sample recent transactions
    const recentTransactions = [
        { id: 1, date: "2025-04-05", description: "Grocery Store", category: "Groceries", amount: -85.42 },
        { id: 2, date: "2025-04-04", description: "Monthly Salary", category: "Income", amount: 5000.00 },
        { id: 3, date: "2025-04-03", description: "Restaurant", category: "Eating out", amount: -64.50 },
        { id: 4, date: "2025-04-02", description: "Electric Bill", category: "Bills", amount: -120.75 },
        { id: 5, date: "2025-04-01", description: "Online Store", category: "Shopping", amount: -39.99 }
    ];

    // Sample upcoming bills
    const upcomingBills = [
        { id: 1, dueDate: "2025-04-15", description: "Rent", amount: 1200.00 },
        { id: 2, dueDate: "2025-04-20", description: "Internet", amount: 59.99 },
        { id: 3, dueDate: "2025-04-22", description: "Phone Bill", amount: 45.00 },
        { id: 4, dueDate: "2025-04-28", description: "Water Bill", amount: 35.75 }
    ];

    // Sample savings goals
    const savingsGoals = [
        { id: 1, name: "Emergency Fund", target: 10000, current: 5000, deadline: "2025-12-31" },
        { id: 2, name: "Vacation", target: 2500, current: 1250, deadline: "2025-07-15" },
        { id: 3, name: "New Laptop", target: 1500, current: 750, deadline: "2025-09-01" }
    ];

    const calculateRemainingBudget = () => {
        return budgetData.budgetSet - budgetData.amountSpent;
    };

    return (
        <div className={styles.app}>
            <AuthenticatedNavbar />
            
            {/* Dashboard Header */}
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Dashboard</h1>
                    <p className={styles.heroDescription}>Welcome to your financial overview</p>
                </div>
            </div>

            {/* Overview Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Financial Overview</h2>
                    <p className={styles.metricsDescription}>Your key metrics for this month</p>
                </div>

                <div className={styles.metricsCards}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Monthly Income</div>
                        <div className={styles.metricValue}>£{budgetData.monthlySalary}</div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Total Spent</div>
                        <div className={styles.metricValue}>£{budgetData.amountSpent}</div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Remaining Budget</div>
                        <div className={`${styles.metricValue} ${calculateRemainingBudget() >= 0 ? styles.positiveAmount : styles.negativeAmount}`}>
                            £{calculateRemainingBudget()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Visualization Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Budget Overview</h2>
                    <p className={styles.metricsDescription}>Visualize your spending vs. budget</p>
                </div>
                <div className={styles.chartContainer}>
                    <BudgetPieChart budgetData={budgetData} />
                </div>
            </div>

            {/* Category Spending Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending by Category</h2>
                    <p className={styles.metricsDescription}>How your money is distributed across categories</p>
                </div>
                <div className={styles.chartContainer}>
                    <SpendingCategoryPieChart SpendingCategoryData={SpendingCategoryData} />
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Recent Transactions</h2>
                    <p className={styles.metricsDescription}>Your latest financial activities</p>
                </div>
                <div className={`${styles.chartContainer} ${styles.tableContainer}`}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.description}</td>
                                    <td>{transaction.category}</td>
                                    <td className={`${styles.amountCell} ${transaction.amount >= 0 ? styles.positiveAmount : styles.negativeAmount}`}>
                                        £{Math.abs(transaction.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.viewAllContainer}>
                        <Link to="/data" className={styles.linkNoDecoration}>
                            <button className={styles.primaryButton}>View All Transactions</button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Two-column layout for upcoming bills and savings goals */}
            <div className={`${styles.metricsSection} ${styles.twoColumnSection}`}>
                {/* Upcoming Bills */}
                <div className={styles.columnContainer}>
                    <div className={styles.metricsHeader}>
                        <h2 className={styles.metricsTitle}>Upcoming Bills</h2>
                        <p className={styles.metricsDescription}>Don't miss your payments</p>
                    </div>
                    <div className={`${styles.chartContainer} ${styles.fullHeightContainer}`}>
                        {upcomingBills.map(bill => (
                            <div key={bill.id} className={styles.billItem}>
                                <div className={styles.billItemContent}>
                                    <div>
                                        <div className={styles.billTitle}>{bill.description}</div>
                                        <div className={styles.billDate}>Due: {bill.dueDate}</div>
                                    </div>
                                    <div className={styles.billAmount}>£{bill.amount.toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Savings Goals */}
                <div className={styles.columnContainer}>
                    <div className={styles.metricsHeader}>
                        <h2 className={styles.metricsTitle}>Savings Goals</h2>
                        <p className={styles.metricsDescription}>Track your progress</p>
                    </div>
                    <div className={`${styles.chartContainer} ${styles.fullHeightContainer}`}>
                        {savingsGoals.map(goal => {
                            const progressPercentage = (goal.current / goal.target) * 100;
                            return (
                                <div key={goal.id} className={styles.savingsGoalItem}>
                                    <div className={styles.savingsGoalHeader}>
                                        <div className={styles.savingsGoalTitle}>{goal.name}</div>
                                        <div>{`£${goal.current} / £${goal.target}`}</div>
                                    </div>
                                    <div className={styles.progressBarBackground}>
                                        <div 
                                            className={styles.progressBarFill}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    <div className={styles.savingsGoalDate}>
                                        Target date: {goal.deadline}
                                    </div>
                                </div>
                            );
                        })}
                        <div className={styles.viewAllContainer}>
                            <Link to="/finance-targets" className={styles.linkNoDecoration}>
                                <button className={styles.primaryButton}>Manage Goals</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Quick Actions</h2>
                </div>
                <div className={styles.quickActionsContainer}>
                    <Link to="/add-expense" className={styles.linkNoDecoration}>
                        <button className={styles.primaryButton}>Add Expense</button>
                    </Link>
                    <Link to="/add-card" className={styles.linkNoDecoration}>
                        <button className={styles.primaryButton}>Add Payment Card</button>
                    </Link>
                    <Link to="/data" className={styles.linkNoDecoration}>
                        <button className={styles.primaryButton}>View Full Report</button>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;