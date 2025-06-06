import React, { useState, useEffect } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Link } from 'react-router-dom';

// Import Components
import styles from "../Styles.module.css";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

// Import Reports
import BudgetPieChart from "../finance_modules/BudgetPieChart.jsx";
import SpendingCategoryPieChart, {SpendingCategoryBarChart} from "../finance_modules/SpendingCategoryCharts.jsx";
import SpendingMonthlyBarChart from "../finance_modules/SpendingMonthlyBarChart.jsx";

// Import Database Client and User ID
import supabaseClient from "../auth/Client.js";
import userID from "../auth/SessionData.js";

Chart.register(ArcElement, Tooltip, Legend);

const DataAnalysis = () => {
    // State variables for data
    const [loading, setLoading] = useState(true);
    const [spendingCategoryData, setSpendingCategoryData] = useState({});
    const [moneySpentMonthly, setMoneySpentMonthly] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [currentMonth, setCurrentMonth] = useState('');
    const [currentYear, setCurrentYear] = useState('');
    const [amountSpent, setAmountSpent] = useState(0);
    const [userSalary, setUserSalary] = useState(0);
    const [hasSalarySet, setHasSalarySet] = useState(false);

    // Budget data with dynamic amountSpent
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

                // Get all expenses with category information
                const { data: expensesData, error: expensesError } = await supabaseClient
                    .from('Expenses')
                    .select(`
                        id,
                        Description,
                        Amount,
                        Date,
                        Categories:Category_id (id, Name) 
                    `)
                    .eq('User_id', userId);

                if (expensesError) {
                    console.error('Error fetching expenses:', expensesError);
                    return;
                }

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
                    const categoryName = expense.Categories?.Name || 'Uncategorized'; // this is here just because if u delete a category the expenses set the category to NULL
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

                // Calculate spending by month
                const monthlySpending = new Array(12).fill(0);

                // Group expenses by month
                expensesData.forEach(expense => {
                    const expenseDate = new Date(expense.Date);
                    const expenseMonth = expenseDate.getMonth(); // 0-indexed
                    const expenseYear = expenseDate.getFullYear();

                    // Only count expenses from the current year
                    if (expenseYear === year) {
                        monthlySpending[expenseMonth] += expense.Amount || 0;
                    }
                });

                setMoneySpentMonthly(monthlySpending);

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
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Budget Report</h1>
                    <p className={styles.heroDescription}>Details of your net income after deductions.</p>
                </div>
            </div>

            {/* Financial Summary Section - using Dashboard style */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Financial Summary - {currentMonth} {currentYear}</h2>
                    <p className={styles.metricsDescription}>Your financial metrics at a glance</p>
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
                        <h2 className={styles.metricsTitle}>Spending Overview - {currentMonth} {currentYear}</h2>
                        <p className={styles.metricsDescription}>How much money you've spent, at a glance</p>
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
                    <h2 className={styles.metricsTitle}>Spending Per Category - {currentMonth} {currentYear}</h2>
                    <p className={styles.metricsDescription}>How your money is distributed across categories this month</p>
                </div>
                <div className={styles.chartContainer}>
                    {loading ? (
                        <div className={styles.loadingMessage}>Loading category data...</div>
                    ) : Object.keys(spendingCategoryData).length === 0 ? (
                        <div className={styles.noDataMessage}>
                            No spending data available for {currentMonth}. Add some expenses to see your spending breakdown.
                        </div>
                    ) : (
                        <SpendingCategoryPieChart SpendingCategoryData={spendingCategoryData} />
                    )}
                </div>
                <div className={styles.chartContainer}>
                    {loading ? (
                        <div className={styles.loadingMessage}>Loading category data...</div>
                    ) : Object.keys(spendingCategoryData).length === 0 ? (
                        <div className={styles.noDataMessage}>
                            No spending data available for {currentMonth}. Add some expenses to see your spending breakdown.
                        </div>
                    ) : (
                        <SpendingCategoryBarChart SpendingCategoryData={spendingCategoryData} />
                    )}
                </div>
            </div>

            {/* Monthly Spending Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending Per Month - {currentYear}</h2>
                    <p className={styles.metricsDescription}>How much money you've spent per month, broken down</p>
                </div>
                <div className={styles.chartContainer}>
                    {loading ? (
                        <div className={styles.loadingMessage}>Loading monthly data...</div>
                    ) : (
                        <SpendingMonthlyBarChart MoneySpentMonthly={moneySpentMonthly} />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DataAnalysis;