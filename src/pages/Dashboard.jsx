import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "../Styles.module.css";

// Import Components
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

// Import Charts
import BudgetPieChart from "../finance_modules/BudgetPieChart.jsx";
import SpendingCategoryPieChart from "../finance_modules/SpendingCategoryCharts.jsx";

// Import Database Client and User ID
import supabaseClient from "../auth/Client.js";
import userID from "../auth/SessionData.js";

const Dashboard = () => {
    // State variables for data
    const [loading, setLoading] = useState(true);
    const [spendingCategoryData, setSpendingCategoryData] = useState({});
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');
    const [currentYear, setCurrentYear] = useState('');

    // Sample data for other sections (TO DO replace with DB entries)
    const budgetData = {
        monthlySalary: 5000,
        tax: 1250,
        amountSpent: 2800,
        bonus: 500,
        budgetSet: 3000,
        grossSalary: 6250
    };

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

    // Function to get month name from month number
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get the user ID from the session
                const userId = await userID;

                // Get current month and year
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1; // JavaScript months are 0-indexed

                // Set current month and year for display
                setCurrentMonth(getMonthName(month));
                setCurrentYear(year);

                // Create date range for current month
                const startDate = `${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`;
                const lastDay = new Date(year, month, 0).getDate(); // Get last day of current month
                const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}T23:59:59.999Z`;

                // Get expenses and use join on the categories table
                const { data: expensesData, error: expensesError } = await supabaseClient
                    .from('Expenses')
                    .select(`
                        id,
                        Description,
                        Amount,
                        Date,
                        Categories:Category_id (id, Name) 
                    `)
                    .eq('User_id', userId)
                    .order('Date', { ascending: false });

                if (expensesError) {
                    console.error('Error fetching expenses:', expensesError);
                    return;
                }

                // Process expenses for 5 most recent transactions (regardless of month)
                const processedTransactions = expensesData
                    .slice(0, 5) // Get the 5 most recent transactions
                    .map(expense => ({
                        id: expense.id,
                        date: new Date(expense.Date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
                        description: expense.Description,
                        category: expense.Categories?.Name || 'Uncategorized',
                        amount: -expense.Amount // Expenses are negative amounts
                    }));

                setRecentTransactions(processedTransactions);

                // Filter expenses for current month only
                const currentMonthExpenses = expensesData.filter(expense => {
                    const expenseDate = new Date(expense.Date);
                    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
                });

                // Process monthly spending by category
                const categorySpending = {};

                // Process current month expenses to group by category and sum amounts
                currentMonthExpenses.forEach(expense => {
                    const categoryName = expense.Categories?.Name || 'Uncategorized';
                    const amount = expense.Amount || 0;

                    // Initialize the category if it doesn't exist
                    if (!categorySpending[categoryName]) {
                        categorySpending[categoryName] = 0;
                    }

                    // Add the amount to the category total
                    categorySpending[categoryName] += amount;
                });

                // Convert for pie chart
                const formattedCategoryData = {};
                for (const [category, amount] of Object.entries(categorySpending)) {
                    formattedCategoryData[category] = amount.toString();
                }

                setSpendingCategoryData(formattedCategoryData);
            } catch (error) {
                console.error('Exception while fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(r => null);
    }, []);

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
                    <h2 className={styles.metricsTitle}>Spending by Category - {currentMonth} {currentYear}</h2>
                    <p className={styles.metricsDescription}>How your money is distributed across categories this month</p>
                </div>
                <div className={styles.chartContainer}>
                    {loading ? (
                        <div className={styles.loadingMessage}>Loading spending data...</div>
                    ) : Object.keys(spendingCategoryData).length === 0 ? (
                        <div className={styles.noDataMessage}>
                            No spending data available for {currentMonth}. Add some expenses to see your spending breakdown.
                        </div>
                    ) : (
                        <SpendingCategoryPieChart SpendingCategoryData={spendingCategoryData} />
                    )}
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Recent Transactions</h2>
                    <p className={styles.metricsDescription}>Your latest financial activities</p>
                </div>
                <div className={`${styles.chartContainer} ${styles.tableContainer}`}>
                    {loading ? (
                        <div className={styles.loadingMessage}>Loading transactions...</div>
                    ) : recentTransactions.length === 0 ? (
                        <div className={styles.noDataMessage}>
                            No transactions available. Add some expenses to see your recent transactions.
                        </div>
                    ) : (
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
                    )}
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