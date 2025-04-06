import React, { useState, useEffect } from 'react';

// Import Components
import styles from "../Styles.module.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const AddExpense = () => {
    // State for form inputs
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Bills');
    const [selectedCard, setSelectedCard] = useState('');
    const [availableCards, setAvailableCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Adding testing data (same way the db would work)
        setTimeout(() => {
            const mockCards = [
                { id: 1, User_id: "1", Bank_name: "Starling" },
                { id: 2, User_id: "1", Bank_name: "Monzo"},
                { id: 3, User_id: "1", Bank_name: "American Express" }
            ];
            setAvailableCards(mockCards); // TO DO replace with db card data structure
            setLoading(false); // TO DO change to true ^
        }, 500);

        // TO DO Add db code in place of this function
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Input validation in JS
        if (!expenseName.trim()) {
            alert("Please enter an expense name");
            return;
        }

        // More input validation around numbers
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        // Validate card selection
        if (!selectedCard) {
            alert("Please select a payment card");
            return;
        }

        // Creates the JSON for the db
        const expenseData = {
            name: expenseName.trim(),
            amount: amountValue,
            category: category,
            cardId: selectedCard,
        };

        // Log to console
        console.log("New expense data:");
        console.log(JSON.stringify(expenseData, null, 2));

        // TO DO Database Code here

        // Reset form
        setExpenseName('');
        setAmount('');
        setCategory('Bills');
        setSelectedCard('');

        // Show success message
        alert("Expense saved successfully!");
    };

    // Handle cancel action
    const handleCancel = () => {
        // Reset form
        setExpenseName('');
        setAmount('');
        setCategory('Bills');
        setSelectedCard('');
    };

    return (
        <div className={`${styles.app} ${styles.whiteBackground} ${styles.paddingTop30}`}>
            <Navbar />
            <div className={`${styles.metricsSection} ${styles.paddingTop30}`}>
                <div className={styles.metricsHeader}>
                    <h1 className={styles.metricsTitle}>Add New Expense</h1>
                    <p className={styles.metricsDescription}>Enter the details of your new expense below.</p>
                </div>

                <div className={styles.metricsCards}>
                    <div className={`${styles.metricCard} ${styles.formCardContainer}`}>
                        <div className={styles.formGroup}>
                            <div className={styles.formLabel}>Expense Name</div>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={expenseName}
                                onChange={(e) => setExpenseName(e.target.value)}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.formLabel}>Amount</div>
                            <input
                                type="text"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={styles.formInput}
                            />
                        </div>

                        {/* Payment Card Selection */}
                        <div className={styles.formGroup}>
                            <div className={styles.formLabel}>Payment Card</div>
                            {loading ? (
                                <div className={styles.loadingText}>Loading cards...</div>
                            ) : availableCards.length === 0 ? (
                                <div className={styles.noCardsMessage}>
                                    No payment cards available.
                                    <a href="/add-card" className={styles.addCardLink}>
                                        Add a card
                                    </a>
                                </div>
                            ) : (
                                <select
                                    value={selectedCard}
                                    onChange={(e) => setSelectedCard(e.target.value)}
                                    className={styles.formSelect}
                                >
                                    <option value="">Select a payment card</option>
                                    {availableCards.map(card => (
                                        <option key={card.id} value={card.id}>
                                            {card.Bank_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className={styles.categoryContainer}>
                            <div className={styles.formLabel}>Category</div>
                            <div className={styles.categoryButtonsWrapper}>
                                <button
                                    onClick={() => setCategory('Bills')}
                                    className={`${styles.categoryButton} ${category === 'Bills' ? styles.categoryButtonActive : ''}`}
                                >
                                    Bills
                                </button>
                                <button
                                    onClick={() => setCategory('Eating out')}
                                    className={`${styles.categoryButton} ${category === 'Eating out' ? styles.categoryButtonActive : ''}`}
                                >
                                    Eating out
                                </button>
                                <button
                                    onClick={() => setCategory('Essential Spend')}
                                    className={`${styles.categoryButton} ${category === 'Essential Spend' ? styles.categoryButtonActive : ''}`}
                                >
                                    Essential Spend
                                </button>
                                <button
                                    onClick={() => setCategory('Groceries')}
                                    className={`${styles.categoryButton} ${category === 'Groceries' ? styles.categoryButtonActive : ''}`}
                                >
                                    Groceries
                                </button>
                                <button
                                    onClick={() => setCategory('Non-essential Spend')}
                                    className={`${styles.categoryButton} ${category === 'Non-essential Spend' ? styles.categoryButtonActive : ''}`}
                                >
                                    Non-essential Spend
                                </button>
                                <button
                                    onClick={() => setCategory('Shopping')}
                                    className={`${styles.categoryButton} ${category === 'Shopping' ? styles.categoryButtonActive : ''}`}
                                >
                                    Shopping
                                </button>
                                <button
                                    onClick={() => setCategory('Savings')}
                                    className={`${styles.categoryButton} ${category === 'Savings' ? styles.categoryButtonActive : ''}`}
                                >
                                    Savings
                                </button>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button
                                onClick={handleCancel}
                                className={`${styles.primaryButton} ${styles.cancelButton}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={styles.primaryButton}
                                
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

export default AddExpense;