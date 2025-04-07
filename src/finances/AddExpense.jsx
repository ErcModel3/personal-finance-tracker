import React, { useState, useEffect } from 'react';

// Import Components
import styles from "../Styles.module.css";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

const AddExpense = () => {
    // State for form inputs
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Bills');
    const [selectedCard, setSelectedCard] = useState('');
    const [availableCards, setAvailableCards] = useState([]);
    const [loading, setLoading] = useState(true);
    // New state for custom categories
    const [customCategory, setCustomCategory] = useState('');

    const [categories, setCategories] = useState([
        'Bills', 'Eating out', 'Essential Spend', 'Groceries',
        'Non-essential Spend', 'Shopping', 'Savings'
    ]);
    const [defaultCategories] = useState([
        'Bills', 'Eating out', 'Essential Spend', 'Groceries',
        'Non-essential Spend', 'Shopping', 'Savings'
    ]);
    const [showCustomInput, setShowCustomInput] = useState(false);

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

        // Save to localStorage or database (Rowan's problem)
        const savedCategories = localStorage.getItem('customCategories');
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }
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
        setShowCustomInput(false);
    };

    // Handle adding a new custom category
    const handleAddCustomCategory = () => {
        if (customCategory.trim() === '') {
            alert("Please enter a category name");
            return;
        }

        if (categories.includes(customCategory.trim())) {
            alert("This category already exists");
            return;
        }

        const updatedCategories = [...categories, customCategory.trim()];
        setCategories(updatedCategories);
        setCategory(customCategory.trim());
        setCustomCategory('');
        setShowCustomInput(false);

        // Save to localStorage or database (Rowan's problem)
        localStorage.setItem('customCategories', JSON.stringify(updatedCategories));
    };

    // Handle removing a category
    const handleRemoveCategory = (categoryToRemove) => {
        // Don't allow removing the category if it's currently selected
        if (category === categoryToRemove) {
            alert("Cannot remove currently selected category");
            return;
        }

        // Prevent removing default categories
        if (defaultCategories.includes(categoryToRemove)) {
            const confirmRemove = window.confirm("Are you sure you want to remove this default category?");
            if (!confirmRemove) return;
        }

        // To prevent accidents
        if (categories.includes(categoryToRemove)) {
            const confirmRemove = window.confirm("Are you sure you want to remove this category?");
            if (!confirmRemove) return;
        }

        const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
        setCategories(updatedCategories);

        // Save to localStorage or database (Rowan's problem)
        localStorage.setItem('customCategories', JSON.stringify(updatedCategories));
    };

    return (
        <div className={`${styles.app} ${styles.whiteBackground} ${styles.paddingTop30}`}>
            <AuthenticatedNavbar />
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
                                {categories.map(cata => (
                                    <div key={cata} className={styles.categoryButtonContainer}>
                                        <button
                                            onClick={() => setCategory(cata)}
                                            className={`${styles.categoryButton} ${category === cata ? styles.categoryButtonActive : ''}`}
                                        >
                                            {cata}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCategory(cata);
                                            }}
                                            className={styles.removeCategoryButton}
                                            title="Remove category"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setShowCustomInput(!showCustomInput)}
                                    className={`${styles.categoryButton}`}
                                >
                                    + Add Custom
                                </button>
                            </div>

                            {showCustomInput && (
                                <div className={`${styles.formGroup} `}>
                                    <input
                                        type="text"
                                        placeholder="Enter custom category"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className={styles.formInput}
                                    />
                                    <button
                                        onClick={handleAddCustomCategory}
                                        className={`${styles.primaryButton} `}
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
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

//Don't need this to my knowledge but keep it here just in case Kirk whines

/*Bills
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
*/

export default AddExpense;