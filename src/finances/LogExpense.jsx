import React, { useState } from 'react';

// Import Components
import styles from "../Styles.module.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const LogExpense = () => {
    // State for form inputs
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Bills');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to save expense data
        console.log({
            expenseName,
            amount,
            category
        });

        // Reset form
        setExpenseName('');
        setAmount('');
        setCategory('Bills');
    };

    // Handle cancel action
    const handleCancel = () => {
        // Reset form or navigate back
        setExpenseName('');
        setAmount('');
        setCategory('Bills');
    };

    return (
        <div className={styles.app} style={{ minHeight: 'auto' }} style={{ paddingTop: '30px', background: 'white'}} >
            <Navbar />
            <div className={styles.metricsSection} style={{ paddingTop: '30px' }}>
            {/*<div className={styles.metricsSection}>*/}
                <div className={styles.metricsHeader}>
                    <h1 className={styles.metricsTitle}>Add New Expense</h1>
                    <p className={styles.metricsDescription}>Enter the details of your new expense below.</p>
                </div>

                <div className={styles.metricsCards}>
                    <div className={styles.metricCard} style={{
                        flexBasis: '100%',
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '20px'
                    }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Expense Name</div>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={expenseName}
                                onChange={(e) => setExpenseName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Amount</div>
                            <input
                                type="text"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Category</div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                justifyContent: 'center',
                            }}>
                                <button
                                    onClick={() => setCategory('Bills')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        background: category === 'Bills' ? '#eee' : 'white',
                                        cursor: 'pointer',
                                        marginBottom: '5px'
                                    }}
                                >
                                    Bills
                                </button>
                                <button
                                    onClick={() => setCategory('Eating out')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        background: category === 'Eating out' ? '#eee' : 'white',
                                        cursor: 'pointer',
                                        marginBottom: '5px'
                                    }}
                                >
                                    Eating out
                                </button>
                                <button
                                    onClick={() => setCategory('Essential Spend')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        background: category === 'Essential Spend' ? '#eee' : 'white',
                                        cursor: 'pointer',
                                        marginBottom: '5px'
                                    }}
                                >
                                    Essential Spend
                                </button>
                                <button
                                    onClick={() => setCategory('Groceries')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        background: category === 'Groceries' ? '#eee' : 'white',
                                        cursor: 'pointer',
                                        marginBottom: '5px'
                                    }}
                                >
                                    Groceries
                                </button>
                                <button
                                    onClick={() => setCategory('Non-essential Spend')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        background: category === 'Non-essential Spend' ? '#eee' : 'white',
                                        cursor: 'pointer',
                                        marginBottom: '5px'
                                    }}
                                >
                                    Non-essential Spend
                                </button>
                                <button
                                    onClick={() => setCategory('Shopping')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        background: category === 'Shopping' ? '#eee' : 'white',
                                        cursor: 'pointer',
                                        marginBottom: '5px'
                                    }}
                                >
                                    Shopping
                                </button>
                                <button
                                    onClick={() => setCategory('Savings')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        background: category === 'Savings' ? '#eee' : 'white',
                                        cursor: 'pointer',
                                        marginBottom: '5px'
                                    }}
                                >
                                    Savings
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={handleCancel}
                                className={styles.primaryButton}
                                style={{
                                    flex: 1,
                                    maxWidth: '45%',
                                    margin: '0'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={styles.primaryButton}
                                style={{
                                    flex: 1,
                                    maxWidth: '45%',
                                    margin: '0'
                                }}
                            >
                                Save Expense
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LogExpense;