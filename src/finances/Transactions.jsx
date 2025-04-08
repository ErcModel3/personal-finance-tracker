import React, { useState, useEffect } from 'react';
import styles from "../Styles.module.css"; // Using the same styles as Dashboard
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

// Import Database Client and User ID
import supabaseClient from "../auth/Client.js";
import userID from "../auth/SessionData.js";

const Transactions = () => {
    // State variables for data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    // Filter states
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cardFilter, setCardFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [bankCards, setBankCards] = useState([]);
    const [monthlyData, setMonthlyData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get the user ID from the session
                const userId = await userID;
                
                // Get all bank cards first so we can use them as a lookup
                const { data: cardsData, error: cardsError } = await supabaseClient
                    .from('Bank_Cards')
                    .select('*')
                    .eq('User_id', userId);
                
                if (cardsError) {
                    console.error('Error fetching bank cards:', cardsError);
                }
                
                // Create a lookup for cards by ID
                const cardLookup = {};
                if (cardsData && cardsData.length > 0) {
                    cardsData.forEach(card => {
                        cardLookup[card.id] = {
                            name: card.Bank_name || 'Unknown Card',
                            last4: card.Last4Digits || '0000'
                        };
                    });
                    
                    // Keep track of available cards for filtering
                    setBankCards(cardsData.map(card => ({
                        id: card.id,
                        name: card.Bank_name,
                        last4: card.Last4Digits || '0000'
                    })));
                }
                
                // Get categories for lookup
                const { data: categoriesData, error: catError } = await supabaseClient
                    .from('Categories')
                    .select('*');
                    
                if (catError) {
                    console.error('Error fetching categories:', catError);
                }
                
                // Create a lookup for categories
                const categoryLookup = {};
                if (categoriesData) {
                    categoriesData.forEach(cat => {
                        categoryLookup[cat.id] = cat.Name;
                    });
                    
                    // Extract unique categories for filtering
                    setCategories(categoriesData.map(cat => cat.Name).filter(Boolean));
                }
                
                // Get expenses data - note that the field is "Bankcard_id" not "Card_id"
                const { data: expensesData, error: expensesError } = await supabaseClient
                    .from('Expenses')
                    .select('*')
                    .eq('User_id', userId)
                    .order('Date', { ascending: false });

                if (expensesError) {
                    console.error('Error fetching expenses:', expensesError);
                    setError('Failed to fetch expenses');
                    return;
                }
                
                console.log('First expense for debugging:', expensesData[0]);
                
                // Process all transactions
                const processedTransactions = expensesData.map(expense => {
                    // Get category name from lookup
                    const categoryName = expense.Category_id && categoryLookup[expense.Category_id] 
                        ? categoryLookup[expense.Category_id] 
                        : 'Uncategorized';
                    
                    // Get card info from lookup - note that it's "Bankcard_id" in your DB
                    const cardId = expense.Bankcard_id;
                    const card = cardId && cardLookup[cardId] 
                        ? cardLookup[cardId]
                        : { name: 'Unknown Card', last4: '0000' };
                    
                    return {
                        id: expense.id,
                        date: new Date(expense.Date).toISOString().split('T')[0],
                        description: expense.Description || 'Unnamed Transaction',
                        category: categoryName,
                        amount: -expense.Amount, // Expenses are negative amounts
                        cardName: card.name,
                        cardNumber: card.last4 ? `**** ${card.last4}` : '**** 0000',
                        cardId: cardId
                    };
                });

                setTransactions(processedTransactions);
                
                // Process monthly data
                processMonthlyData(processedTransactions);
                
            } catch (error) {
                console.error('Exception while fetching data:', error);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                    categories: {},
                    cards: {} // Track spending by card
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
                
                // Track spending by card
                const cardKey = transaction.cardName;
                if (!monthlyBreakdown[monthYear].cards[cardKey]) {
                    monthlyBreakdown[monthYear].cards[cardKey] = 0;
                }
                monthlyBreakdown[monthYear].cards[cardKey] += Math.abs(transaction.amount);
            }
        });
        
        // Calculate top categories for each month
        Object.keys(monthlyBreakdown).forEach(month => {
            const categories = monthlyBreakdown[month].categories;
            monthlyBreakdown[month].topCategories = Object.entries(categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, amount]) => ({ name, amount }));
                
            // Calculate top cards for each month
            const cards = monthlyBreakdown[month].cards;
            monthlyBreakdown[month].topCards = Object.entries(cards)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map(([name, amount]) => ({ name, amount }));
        });
        
        // Sort monthly data by year and month (most recent first)
        const sortedMonthlyData = {};
        Object.keys(monthlyBreakdown)
            .sort((a, b) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateB - dateA; // Sort in descending order (newest first)
            })
            .forEach(month => {
                sortedMonthlyData[month] = monthlyBreakdown[month];
            });
        
        setMonthlyData(sortedMonthlyData);
    };

    // Apply filters to transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesCategory = categoryFilter ? transaction.category === categoryFilter : true;
        const matchesDate = dateFilter ? transaction.date.includes(dateFilter) : true;
        const matchesCard = cardFilter ? transaction.cardId == cardFilter : true; // Use == for numeric comparison
        const matchesSearch = searchTerm 
            ? transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              transaction.cardName.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        
        return matchesCategory && matchesDate && matchesCard && matchesSearch;
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
        setCardFilter('');
    };

    return (
        <div className={styles.app}>
            <AuthenticatedNavbar />

            {/* Transactions Header - No blue hero section */}
            <div className={`${styles.metricsSection} ${styles.paddingTop30}`}>
                <div className={styles.metricsHeader}>
                    <h1 className={styles.metricsTitle}>Transactions</h1>
                    <p className={styles.metricsDescription}>View and manage all your financial activities</p>
                </div>
            </div>

            {/* Overview Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Financial Summary</h2>
                    <p className={styles.metricsDescription}>Your key metrics for the selected period</p>
                </div>

                <div className={styles.metricsCards}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Income</div>
                        <div className={`${styles.metricValue} ${styles.positiveAmount}`}>£{income.toFixed(2)}</div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Expenses</div>
                        <div className={`${styles.metricValue} ${styles.negativeAmount}`}>£{expenses.toFixed(2)}</div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Balance</div>
                        <div className={`${styles.metricValue} ${balance >= 0 ? styles.positiveAmount : styles.negativeAmount}`}>
                            £{balance.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Filter Transactions</h2>
                    <p className={styles.metricsDescription}>Customize your transaction view</p>
                </div>
                
                <div className={`${styles.chartContainer} ${styles.filterContainer}`}>
                    <div className={styles.filterItem}>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    
                    <div className={styles.filterSelectItem}>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.filterSelectItem}>
                        <select
                            value={cardFilter}
                            onChange={(e) => setCardFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">All Cards</option>
                            {bankCards.map(card => (
                                <option key={card.id} value={card.id}>
                                    {card.name} (**** {card.last4})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.filterSelectItem}>
                        <input
                            type="month"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className={styles.dateFilter}
                        />
                    </div>
                    
                    <div className={styles.filterButtonContainer}>
                        <button 
                            onClick={clearFilters}
                            className={`${styles.primaryButton} ${styles.filterButton}`}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Table Section */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>All Transactions</h2>
                    <p className={styles.metricsDescription}>Your complete transaction history</p>
                </div>
                <div className={`${styles.chartContainer} ${styles.tableContainer}`}>
                    {loading ? (
                        <div className={styles.loadingMessage}>Loading transactions...</div>
                    ) : error ? (
                        <div className={styles.errorMessage}>Error: {error}</div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className={styles.noDataMessage}>
                            {transactions.length === 0 ? 'No transactions found in your account' : 'No transactions found matching your filters'}
                        </div>
                    ) : (
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Bank Card</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td>{formatDate(transaction.date)}</td>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.category}</td>
                                        <td>{transaction.cardName} ({transaction.cardNumber})</td>
                                        <td className={`${styles.amountCell} ${transaction.amount >= 0 ? styles.positiveAmount : styles.negativeAmount}`}>
                                            {transaction.amount > 0 ? '+' : ''}£{Math.abs(transaction.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Monthly Breakdown Section as Table */}
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h2 className={styles.metricsTitle}>Monthly Breakdown</h2>
                    <p className={styles.metricsDescription}>Your spending patterns by month</p>
                </div>
                
                {loading ? (
                    <div className={styles.loadingMessage}>Loading monthly data...</div>
                ) : error ? (
                    <div className={styles.errorMessage}>Error loading monthly data: {error}</div>
                ) : Object.keys(monthlyData).length === 0 ? (
                    <div className={styles.noDataMessage}>No monthly data available</div>
                ) : (
                    <div className={`${styles.chartContainer} ${styles.tableContainer}`}>
                        <table className={`${styles.dataTable} ${styles.monthlyTable}`}>
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Income</th>
                                    <th>Expenses</th>
                                    <th>Savings</th>
                                    <th>Top Categories</th>
                                    <th>Top Cards</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(monthlyData).map(([month, data]) => {
                                    const savings = data.income - data.expenses;
                                    
                                    return (
                                        <tr key={month}>
                                            <td className={styles.monthColumn}>{month}</td>
                                            <td className={styles.positiveAmount}>£{data.income.toFixed(2)}</td>
                                            <td className={styles.negativeAmount}>£{data.expenses.toFixed(2)}</td>
                                            <td className={savings >= 0 ? styles.positiveAmount : styles.negativeAmount}>
                                                £{savings.toFixed(2)}
                                            </td>
                                            <td>
                                                {data.topCategories && data.topCategories.length > 0 ? (
                                                    <ul className={styles.categoryList}>
                                                        {data.topCategories.map((category, index) => (
                                                            <li key={index}>{category.name}: £{category.amount.toFixed(2)}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No category data available</p>
                                                )}
                                            </td>
                                            <td>
                                                {data.topCards && data.topCards.length > 0 ? (
                                                    <ul className={styles.categoryList}>
                                                        {data.topCards.map((card, index) => (
                                                            <li key={index}>{card.name}: £{card.amount.toFixed(2)}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No card data available</p>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Transactions;