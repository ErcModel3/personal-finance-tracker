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
    
    // Add state for upcoming bills and savings targets
    const [upcomingBills, setUpcomingBills] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);

    // Budget data with dynamic amountSpent and monthlySalary
    const [budgetData, setBudgetData] = useState({
        monthlySalary: 0, // Will be updated from the user's salary
        amountSpent: 0, // Will be updated from the database
        bonus: 500,
        budgetSet: 0, // Will be updated to match the salary
    });

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

                // Fetch user's salary data from Monthly_Salary table
                const { data: salaryData, error: salaryError } = await supabaseClient
                    .from('Monthly_Salary')
                    .select('Salary')
                    .eq('userID', userId)
                    .single();

                if (salaryError && salaryError.code !== 'PGRST116') {
                    console.error('Error fetching user salary:', salaryError);
                } else if (salaryData && salaryData.Salary) {
                    // Update the salary if it exists
                    const salary = parseFloat(salaryData.Salary);
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
                
                // Fetch Direct Debits for upcoming bills
                const { data: directDebitsData, error: directDebitsError } = await supabaseClient
                    .from('Direct_Debits')
                    .select('*')
                    .eq('Userid', userId)
                    .order('Start_date', { ascending: false });
                
                if (directDebitsError) {
                    console.error('Error fetching direct debits:', directDebitsError);
                } else {
                    // Process direct debits to determine upcoming payments
                    const now = new Date();
                    const oneMonthFromNow = new Date();
                    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
                    
                    const processedBills = directDebitsData
                        .filter(bill => {
                            const startDate = new Date(bill.Start_date);
                            const endDate = bill.End_Date ? new Date(bill.End_Date) : null;
                            
                            // Include bills that have started and haven't ended
                            return startDate <= now && (!endDate || endDate >= now);
                        })
                        .map(bill => {
                            // Calculate next due date based on recurrence
                            let nextDueDate = new Date(bill.Start_date);
                            
                            // Adjust to find the next occurrence
                            while (nextDueDate < now) {
                                switch(bill.Recurrance) {
                                    case 'Daily':
                                        nextDueDate.setDate(nextDueDate.getDate() + 1);
                                        break;
                                    case 'Weekly':
                                        nextDueDate.setDate(nextDueDate.getDate() + 7);
                                        break;
                                    case 'Monthly':
                                        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                                        break;
                                    case 'Quarterly':
                                        nextDueDate.setMonth(nextDueDate.getMonth() + 3);
                                        break;
                                    case 'Yearly':
                                        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                                        break;
                                    default:
                                        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                                }
                            }
                            
                            return {
                                id: bill.id,
                                dueDate: nextDueDate.toISOString().split('T')[0],
                                description: bill.Name,
                                amount: bill.Amount
                            };
                        })
                        // Only include bills due in the next month
                        .filter(bill => {
                            const dueDate = new Date(bill.dueDate);
                            return dueDate <= oneMonthFromNow;
                        })
                        // Sort by due date
                        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                        // Take only 4 closest upcoming bills
                        .slice(0, 4);
                    
                    setUpcomingBills(processedBills);
                }
                
                // Fetch savings targets/goals
                const { data: targetsData, error: targetsError } = await supabaseClient
                    .from('Targets')
                    .select('*')
                    .eq('User_id', userId);
                
                if (targetsError) {
                    console.error('Error fetching savings targets:', targetsError);
                } else {
                    // Process targets data
                    const processedGoals = targetsData
                        .map(target => ({
                            id: target.id,
                            name: target.Name,
                            target: target.Goal,
                            current: target.Current_completion,
                            deadline: target.Target_date
                        }))
                        // Take only 3 savings goals
                        .slice(0, 3);
                    
                    setSavingsGoals(processedGoals);
                }
                
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
                        <div className={styles.metricLabel}>Monthly Balance</div>
                        {loading ? (
                            <div className={styles.metricValue}>
                                <span className={styles.loadingText}>Loading...</span>
                            </div>
                        ) : hasSalarySet ? (
                            <div className={styles.metricValueContainer}>
                                <div className={styles.metricValue}>£{userSalary.toFixed(2)}</div>
                                <Link to="/monthly-salary" className={styles.linkNoDecoration}>
                                    <button className={`${styles.smallButton} ${styles.salaryButton}`}>Update</button>
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.metricValueContainer}>
                                <div className={styles.metricValue}>Not set</div>
                                <Link to="/monthly-salary" className={styles.linkNoDecoration}>
                                    <button className={`${styles.smallButton} ${styles.salaryButton}`}>Set Salary</button>
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
                                <button className={`${styles.primaryButton} ${styles.salaryButton}`}>Set Your Salary</button>
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
                        <Link to="/transactions" className={styles.linkNoDecoration}>
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
                    <div className={`${styles.tableComponentContainer} ${styles.billsTableContainer}`}>
                        {loading ? (
                            <div className={styles.loadingMessage}>Loading bills...</div>
                        ) : upcomingBills.length === 0 ? (
                            <div className={styles.noDataMessage}>
                                No upcoming bills found. Add direct debits to track your bills.
                                <div className={styles.viewAllContainer} style={{ marginTop: '16px' }}>
                                    <Link to="/direct-debits" className={styles.linkNoDecoration}>
                                        <button className={styles.primaryButton}>Add Direct Debits</button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            upcomingBills.map(bill => (
                                <div key={bill.id} className={styles.billItem}>
                                    <div className={styles.billItemContent}>
                                        <div>
                                            <div className={styles.billTitle}>{bill.description}</div>
                                            <div className={styles.billDate}>Due: {bill.dueDate}</div>
                                        </div>
                                        <div className={styles.billAmount}>£{bill.amount.toFixed(2)}</div>
                                    </div>
                                </div>
                            ))
                        )}
                        {upcomingBills.length > 0 && (
                            <div className={styles.viewAllContainer}>
                                <Link to="/financial-forms" className={styles.linkNoDecoration}>
                                    <button className={styles.primaryButton}>Manage Bills</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Savings Goals - Restyled to match upcoming bills */}
                <div className={styles.columnContainer}>
                    <div className={styles.metricsHeader}>
                        <h2 className={styles.metricsTitle}>Savings Goals</h2>
                        <p className={styles.metricsDescription}>Track your progress</p>
                    </div>
                    <div className={`${styles.tableComponentContainer} ${styles.billsTableContainer}`}>
                        {loading ? (
                            <div className={styles.loadingMessage}>Loading goals...</div>
                        ) : savingsGoals.length === 0 ? (
                            <div className={styles.noDataMessage}>
                                No savings goals yet. Set up your first goal to start tracking!
                                <div className={styles.viewAllContainer} style={{ marginTop: '16px' }}>
                                    <Link to="/finance-targets" className={styles.linkNoDecoration}>
                                        <button className={styles.primaryButton}>Create Goals</button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            savingsGoals.map(goal => (
                                <div key={goal.id} className={styles.billItem}>
                                    <div className={styles.billItemContent}>
                                        <div>
                                            <div className={styles.billTitle}>{goal.name}</div>
                                            <div className={styles.billDate}>Target date: {new Date(goal.deadline).toLocaleDateString()}</div>
                                        </div>
                                        <div className={styles.billAmount}>
                                            £{goal.current.toFixed(2)} / £{goal.target.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {savingsGoals.length > 0 && (
                            <div className={styles.viewAllContainer}>
                                <Link to="/finance-targets" className={styles.linkNoDecoration}>
                                    <button className={styles.primaryButton}>Manage Goals</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;