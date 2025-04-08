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
    const [amountSpent, setAmountSpent] = useState(0);
    const [userSalary, setUserSalary] = useState(0);
    const [hasSalarySet, setHasSalarySet] = useState(false);

    // Budget data with dynamic amountSpent and monthlySalary
    const [budgetData, setBudgetData] = useState({
        monthlySalary: 0, // Will be updated from the user's profile
        amountSpent: 0, // Will be updated from the database
        bonus: 500,
        budgetSet: 0, // Will be updated to match the salary
    });

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

                // Fetch user's profile data to get the monthly salary
                const { data: profileData, error: profileError } = await supabaseClient
                    .from('profiles')
                    .select('monthly_salary')
                    .eq('auth_user_id', userId)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Error fetching user profile:', profileError);
                } else if (profileData && profileData.monthly_salary) {
                    // Update the salary if it exists in the profile
                    const salary = parseFloat(profileData.monthly_salary);
                    setUserSalary(salary);
                    setHasSalarySet(true);
                    
                    // Update budget data with user's salary
                    setBudgetData(prevData => ({
                        ...prevData,
                        monthlySalary: salary,
                        budgetSet: salary // Set budget to match salary
                    }));
                } else {
                    // No salary set yet
                    setHasSalarySet(false);
                }

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

                // Calculate total amount spent this month
                const totalSpent = currentMonthExpenses.reduce(
                    (total, expense) => total + (expense.Amount || 0),
                    0
                );

                // Update amountSpent
                setAmountSpent(totalSpent);

                // Update budget data with the new amountSpent
                setBudgetData(prevData => ({
                    ...prevData,
                    amountSpent: totalSpent
                }));

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
                    <h2 className={styles.metricsTitle}>Financial Overview - {currentMonth} {currentYear}</h2>
                    <p className={styles.metricsDescription}>Your key metrics for this month</p>
                </div>

                <div className={styles.metricsCards}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Monthly Income</div>
                        {loading ? (
                            <div className={styles.metricValue}>
                                <span className={styles.loadingText}>Loading...</span>
                            </div>
                        ) : hasSalarySet ? (
                            <div className={styles.metricValue}>£{userSalary.toFixed(2)}</div>
                        ) : (
                            <div className={styles.metricValueContainer}>
                                <div className={styles.metricValue}>Not set</div>
                                <Link to="/monthly-salary" className={styles.linkNoDecoration}>
                                    <button className={styles.smallButton}>Set Salary</button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Total Spent</div>
                        <div className={styles.metricValue}>
                            {loading ? (
                                <span className={styles.loadingText}>Loading...</span>
                            ) : (
                                `£${budgetData.amountSpent.toFixed(2)}`
                            )}
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Remaining Budget</div>
                        <div className={`${styles.metricValue} ${calculateRemainingBudget() >= 0 ? styles.positiveAmount : styles.negativeAmount}`}>
                            {loading ? (
                                <span className={styles.loadingText}>Loading...</span>
                            ) : hasSalarySet ? (
                                `£${calculateRemainingBudget().toFixed(2)}`
                            ) : (
                                "Set salary first"
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Visualization Section - Only show if salary is set */}
            {hasSalarySet && (
                <div className={styles.metricsSection}>
                    <div className={styles.metricsHeader}>
                        <h2 className={styles.metricsTitle}>Budget Overview - {currentMonth} {currentYear}</h2>
                        <p className={styles.metricsDescription}>Visualize your spending vs. budget</p>
                    </div>
                    <div className={styles.chartContainer}>
                        {loading ? (
                            <div className={styles.loadingMessage}>Loading budget data...</div>
                        ) : (
                            <BudgetPieChart budgetData={budgetData} />
                        )}
                    </div>
                </div>
            )}

            {/* Salary Notice - Show if no salary is set */}
            {!hasSalarySet && !loading && (
                <div className={styles.metricsSection}>
                    <div className={`${styles.chartContainer} ${styles.salaryNoticeContainer}`}>
                        <div className={styles.salaryNotice}>
                            <h3>Set Your Monthly Salary</h3>
                            <p>
                                To get the most out of your financial dashboard, please set your monthly salary.
                                This will help us provide accurate budget visualizations and financial insights.
                            </p>
                            <Link to="/monthly-salary" className={styles.linkNoDecoration}>
                                <button className={styles.primaryButton}>Set Your Salary</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

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

            <Footer />
        </div>
    );
};

export default Dashboard;