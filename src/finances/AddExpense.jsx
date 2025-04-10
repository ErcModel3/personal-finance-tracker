import React, {useEffect, useState} from 'react';

// Import Components
import styles from "../Styles.module.css";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";
import userID from "../auth/SessionData.js";
import supabaseClient from "../auth/Client.js";

const getSessionID = async () => {
    return await userID;
}

const AddExpense = () => {
    // State for form inputs
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [selectedCard, setSelectedCard] = useState('');
    const [availableCards, setAvailableCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // New state for custom categories
    const [customCategory, setCustomCategory] = useState('');

    // Initialize with empty array instead of hardcoded values
    const [categories, setCategories] = useState([]);
    const [showCustomInput, setShowCustomInput] = useState(false);

    useEffect(() => {
        // Function to fetch user ID asyncronously
        const fetchUserID = async () => {
            const userId = await getSessionID();
            return userId; //inlining this return data causes issues parsing data to the other functions so don't 'improve' this plz.
        };

        // fetch categories from supabase
        const fetchCategories = async (userId) => {
            setCategoriesLoading(true);
            try {
                const { data, error } = await supabaseClient
                    .from('Categories')
                    .select('*')
                    .eq('User_id', userId);

                if (error) {
                    console.error('Error fetching categories:', error);
                    return [];
                }

                // Store full category objects to preserve ids
                // Filter out any categories with empty names
                return data
                    .filter(item => item.Name && item.Name.trim() !== '')
                    .map(item => ({
                        id: item.id,
                        name: item.Name.trim()
                    }));
            } catch (error) {
                console.error('Exception when fetching categories:', error);
                return [];
            } finally {
                setCategoriesLoading(false);
            }
        };

        //fetch bank cards from Supabase
        const fetchCards = async (userId) => {
            setLoading(true);
            try {
                const { data, error } = await supabaseClient
                    .from('Bank_Cards')
                    .select('*')
                    .eq('User_id', userId);

                if (error) {
                    console.error('Error fetching cards:', error);
                    return [];
                }

                return data;
            } catch (error) {
                console.error('Exception when fetching cards:', error);
                return [];
            } finally {
                setLoading(false);
            }
        };

        //on page load get persisted categories
        const initializeData = async () => {
            const userId = await fetchUserID();

            // Fetch categories
            const userCategories = await fetchCategories(userId);
            setCategories(userCategories);
            if (userCategories.length > 0) {
                setCategory(userCategories[0].name);
                setCategoryId(userCategories[0].id); // Store the category ID
            }

            // Fetch cards
            const userCards = await fetchCards(userId);
            setAvailableCards(userCards);
        };

        initializeData().then(r => null);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
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

            // Validate category selection
            if (!categoryId) {
                alert("Please select a category");
                return;
            }

            // Get user ID
            const userId = await getSessionID();

            // Create the expense object for the database
            const expenseData = {
                User_id: userId,
                Category_id: categoryId,
                Bankcard_id: parseInt(selectedCard), // Ensure it's an integer
                Amount: amountValue,
                Date: new Date().toISOString(), // Current timestamp
                Description: expenseName.trim()
            };

            // Submit to database
            const { data, error } = await supabaseClient
                .from('Expenses')
                .insert([expenseData]);

            if (error) {
                console.error('Error adding expense:', error);
                alert("Failed to save expense. Please try again.");
                return;
            }

            // Reset form
            setExpenseName('');
            setAmount('');
            if (categories.length > 0) {
                setCategory(categories[0].name);
                setCategoryId(categories[0].id);
            } else {
                setCategory('');
                setCategoryId(null);
            }
            setSelectedCard('');

            // Show success message
            alert("Expense saved successfully!");

        } catch (error) {
            console.error('Exception when saving expense:', error);
            alert("An error occurred while saving the expense.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        // Reset form
        setExpenseName('');
        setAmount('');
        if (categories.length > 0) {
            setCategory(categories[0].name);
            setCategoryId(categories[0].id);
        } else {
            setCategory('');
            setCategoryId(null);
        }
        setSelectedCard('');
        setShowCustomInput(false);
    };

    // Handle adding a new custom category to database
    const handleAddCustomCategory = async () => {
        if (customCategory.trim() === '') {
            alert("Please enter a category name");
            return;
        }

        // Check if category already exists by name
        if (categories.some(cat => cat.name === customCategory.trim())) {
            alert("This category already exists");
            return;
        }

        // Get user ID
        const userId = await getSessionID();

        // Add new category to database
        const { data, error } = await supabaseClient
            .from('Categories')
            .insert([
                { Name: customCategory.trim(), User_id: userId }
            ])
            .select();

        if (error) {
            console.error('Error adding category:', error);
            alert("Failed to add category. Please try again.");
            return;
        }

        // Get the new category from the response
        if (data && data.length > 0) {
            const newCategory = {
                id: data[0].id,
                name: customCategory.trim()
            };

            // Update local state with new category
            const updatedCategories = [...categories, newCategory];
            setCategories(updatedCategories);
            setCategory(newCategory.name);
            setCategoryId(newCategory.id);
            setCustomCategory('');
            setShowCustomInput(false);
        } else {
            alert("Category added but could not be loaded. Please refresh the page.");
        }
    };

    // Handle removing a category from database
    const handleRemoveCategory = async (categoryNameToRemove) => {
        // Don't allow removing the category if it's currently selected
        if (category === categoryNameToRemove) {
            alert("Cannot remove currently selected category");
            return;
        }

        // Find the category object by name
        const categoryToRemove = categories.find(cat => cat.name === categoryNameToRemove);
        if (!categoryToRemove) {
            console.error('Category not found:', categoryNameToRemove);
            return;
        }

        // To prevent accidents
        const confirmRemove = window.confirm("Are you sure you want to remove this category?");
        if (!confirmRemove) return;

        // Get user ID
        const userId = await getSessionID();

        // Remove category from database
        const { error } = await supabaseClient
            .from('Categories')
            .delete()
            .eq('id', categoryToRemove.id)
            .eq('User_id', userId);

        if (error) {
            console.error('Error removing category:', error);
            alert("Failed to remove category. Please try again.");
            return;
        }

        // Update local state
        const updatedCategories = categories.filter(cat => cat.id !== categoryToRemove.id);
        setCategories(updatedCategories);
    };

    // Set the category and categoryId when a category is selected
    const handleCategorySelection = (categoryObj) => {
        setCategory(categoryObj.name);
        setCategoryId(categoryObj.id);
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                    <a href="/manage-cards" className={styles.addCardLink}>
                                        Add a card
                                    </a>
                                </div>
                            ) : (
                                <select
                                    value={selectedCard}
                                    onChange={(e) => setSelectedCard(e.target.value)}
                                    className={styles.formSelect}
                                    disabled={submitting}
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
                                {categoriesLoading ? (
                                    <div className={styles.loadingText}>Loading categories...</div>
                                ) : categories.length === 0 ? (
                                    <div className={styles.noCardsMessage}>No categories available. Add one below.</div>
                                ) : (
                                    categories.map(cata => (
                                        <div key={cata.id} className={styles.categoryButtonContainer}>
                                            <button
                                                onClick={() => handleCategorySelection(cata)}
                                                className={`${styles.categoryButton} ${category === cata.name ? styles.categoryButtonActive : ''}`}
                                                disabled={submitting}
                                            >
                                                {cata.name}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveCategory(cata.name);
                                                }}
                                                className={styles.removeCategoryButton}
                                                title="Remove category"
                                                disabled={submitting}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                )}
                                <button
                                    onClick={() => setShowCustomInput(!showCustomInput)}
                                    className={`${styles.categoryButton}`}
                                    disabled={submitting}
                                >
                                    + Add Custom
                                </button>
                            </div>

                            {showCustomInput && (
                                <div className={styles.customCategoryContainer}>
                                    <input
                                        type="text"
                                        placeholder="Enter custom category"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className={styles.customCategoryInput}
                                        disabled={submitting}
                                    />
                                    <button
                                        onClick={handleAddCustomCategory}
                                        className={styles.customCategoryButton}
                                        disabled={submitting}
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
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={styles.primaryButton}
                                disabled={submitting}
                            >
                                {submitting ? "Saving..." : "Save Expense"}
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