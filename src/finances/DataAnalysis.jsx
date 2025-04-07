import React, { useState, useEffect } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto';

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

    // Budget data with dynamic amountSpent
    const [budgetData, setBudgetData] = useState({
        monthlySalary: 4000,
        tax: 1250,
        amountSpent: 0, // Will be updated from the database
        bonus: 500,
        budgetSet: 3000,
        grossSalary: 6250
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

    return (
        <div className={styles.app}>
            <AuthenticatedNavbar />
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
                    <h2 className={styles.metricsTitle}>Financial Summary - {currentMonth} {currentYear}</h2>
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
                        <div className={styles.metricValue}>
                            {loading ? (
                                <span className={styles.loadingText}>Loading...</span>
                            ) : (
                                `£${budgetData.amountSpent.toFixed(2)}`
                            )}
                        </div>
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
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Spending Per Category - {currentMonth} {currentYear}</h2>
                    <p className={styles.metricsDescription}>How much money you've spent per spending category, as a pie chart or a bar chart</p>
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