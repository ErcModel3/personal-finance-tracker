import React, { useState, useEffect } from 'react';
import './Transactions.css';
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [monthlyData, setMonthlyData] = useState({});
    
    // Fetch transactions from the database
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                
                const userId = localStorage.getItem('userId') || '1'; // Fallback to '1' if not available
                
                // Fetch transactions from your API
                const response = await fetch(`/api/expenses?user_id=${userId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                
                const data = await response.json();
                
                // Transform the data to match components expected format
                const formattedTransactions = data.map(item => ({
                    id: item.id,
                    date: new Date(item.Date).toISOString().split('T')[0],
                    description: item.Description || 'Unnamed Transaction',
                    amount: item.Amount,
                    // Fetch category name based on category_id
                    category: item.category_name || 'Uncategorized'
                }));
                
                setTransactions(formattedTransactions);
                
                // Fetch categories
                const categoryResponse = await fetch(`/api/categories?user_id=${userId}`);
                if (categoryResponse.ok) {
                    const categoryData = await categoryResponse.json();
                    setCategories(categoryData.map(cat => cat.Name));
                }
                
                // Process monthly data
                processMonthlyData(formattedTransactions);
                
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTransactions();
    }, []);
    
    // Process transactions data to get monthly summaries
    const processMonthlyData = (transactionsData) => {
        const monthlyBreakdown = {};
        
        transactionsData.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            
            if (!monthlyBreakdown[monthYear]) {
                monthlyBreakdown[monthYear] = {
                    income: 0,
                    expenses: 0,
                    categories: {}
                };
            }
            
            if (transaction.amount > 0) {
                monthlyBreakdown[monthYear].income += transaction.amount;
            } else {
                monthlyBreakdown[monthYear].expenses += Math.abs(transaction.amount);
                
                // Track spending by category
                if (!monthlyBreakdown[monthYear].categories[transaction.category]) {
                    monthlyBreakdown[monthYear].categories[transaction.category] = 0;
                }
                monthlyBreakdown[monthYear].categories[transaction.category] += Math.abs(transaction.amount);
            }
        });
        
        // Calculate top categories for each month
        Object.keys(monthlyBreakdown).forEach(month => {
            const categories = monthlyBreakdown[month].categories;
            monthlyBreakdown[month].topCategories = Object.entries(categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, amount]) => ({ name, amount }));
        });
        
        setMonthlyData(monthlyBreakdown);
    };

    // Apply filters to transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesCategory = categoryFilter ? transaction.category === categoryFilter : true;
        const matchesDate = dateFilter ? transaction.date.includes(dateFilter) : true;
        const matchesSearch = searchTerm 
            ? transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        
        return matchesCategory && matchesDate && matchesSearch;
    });

    // Calculate totals
    const income = filteredTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = income - expenses;

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setCategoryFilter('');
        setDateFilter('');
        setSearchTerm('');
    };
    


    return (
        <div className="transactions-page">
            <AuthenticatedNavbar />

            <div className="content-section">
                <h2 className="section-title">Recent Transactions</h2>
                <p className="section-description">Your complete transaction history</p>

                <div className="summary-stats">
                    <div className="stat-card income">
                        <h3>Income</h3>
                        <p className="stat-amount">£{income.toFixed(2)}</p>
                    </div>
                    <div className="stat-card expenses">
                        <h3>Expenses</h3>
                        <p className="stat-amount">£{expenses.toFixed(2)}</p>
                    </div>
                    <div className="stat-card balance">
                        <h3>Balance</h3>
                        <p className="stat-amount">£{balance.toFixed(2)}</p>
                    </div>
                </div>

                <div className="filter-section">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="filter-controls">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        
                        <input
                            type="month"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="date-filter"
                        />
                        
                        <button 
                            onClick={clearFilters}
                            className="clear-filters-btn"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                <div className="transactions-table-container">
                    {loading ? (
                        <div className="loading-indicator">Loading transactions...</div>
                    ) : error ? (
                        <div className="error-message">Error: {error}</div>
                    ) : (
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map(transaction => (
                                        <tr key={transaction.id}>
                                            <td>{formatDate(transaction.date)}</td>
                                            <td>{transaction.description}</td>
                                            <td>
                                                <span className={`category-tag ${transaction.category.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className={transaction.amount > 0 ? 'amount-positive' : 'amount-negative'}>
                                                {transaction.amount > 0 ? '+' : ''}£{Math.abs(transaction.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="no-transactions">
                                            {transactions.length === 0 ? 'No transactions found in your account' : 'No transactions found matching your filters'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="content-section">
                <h2 className="section-title">Monthly Breakdown</h2>
                <p className="section-description">Your spending patterns by month</p>

                {loading ? (
                    <div className="loading-indicator">Loading monthly data...</div>
                ) : error ? (
                    <div className="error-message">Error loading monthly data: {error}</div>
                ) : (
                    <div className="monthly-breakdown">
                        {Object.keys(monthlyData).length > 0 ? (
                            Object.entries(monthlyData).map(([month, data]) => {
                                const savings = data.income - data.expenses;
                                
                                return (
                                    <div className="month-card" key={month}>
                                        <h3>{month}</h3>
                                        <div className="month-stats">
                                            <p>Income: <span className="positive">£{data.income.toFixed(2)}</span></p>
                                            <p>Expenses: <span className="negative">£{data.expenses.toFixed(2)}</span></p>
                                            <p>Savings: <span className={savings >= 0 ? "positive" : "negative"}>
                                                £{savings.toFixed(2)}
                                            </span></p>
                                        </div>
                                        <div className="category-breakdown">
                                            <h4>Top Categories:</h4>
                                            {data.topCategories && data.topCategories.length > 0 ? (
                                                <ul>
                                                    {data.topCategories.map((category, index) => (
                                                        <li key={index}>{category.name}: £{category.amount.toFixed(2)}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No category data available</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-data-message">No monthly data available</div>
                        )}
                    </div>
                )}
            </div>



            <Footer />
        </div>
    );
};

export default Transactions;