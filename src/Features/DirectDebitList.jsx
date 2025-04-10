import React, { useState, useEffect } from "react";
import styles from "./DirectDebitForm.module.css";
import { Link } from "react-router-dom";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";
import supabaseClient from "../auth/Client.js";

function DirectDebitsList() {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [directDebits, setDirectDebits] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(null);

    // Fetch the current user's ID when component mounts
    useEffect(() => {
        async function getCurrentUser() {
            try {
                const { data, error } = await supabaseClient.auth.getUser();
                
                if (error) {
                    console.error("Error fetching user:", error);
                    return;
                }
                
                if (data && data.user) {
                    setUserId(data.user.id);
                }
            } catch (e) {
                console.error("Exception in getCurrentUser:", e);
            }
        }
        
        getCurrentUser();
    }, []);

    // Fetch direct debits and subscriptions when userId is available
    useEffect(() => {
        if (userId) {
            fetchDirectDebits();
        }
    }, [userId]);

    // Function to fetch all direct debits for the user
    const fetchDirectDebits = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabaseClient
                .from('Direct_Debits')
                .select('*')
                .eq('Userid', userId);
                
            if (error) {
                throw error;
            }
            
            setDirectDebits(data || []);
        } catch (error) {
            console.error("Error fetching direct debits:", error);
            setErrorMessage("Failed to load your direct debits and subscriptions");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to delete a direct debit
    const handleDelete = async (id) => {
        try {
            const { error } = await supabaseClient
                .from('Direct_Debits')
                .delete()
                .eq('id', id);
                
            if (error) {
                throw error;
            }
            
            // Update the list after deletion
            setDirectDebits(prevDebits => prevDebits.filter(debit => debit.id !== id));
            setSuccessMessage("Item deleted successfully!");
            setShowConfirmDelete(null);
        } catch (error) {
            console.error("Error deleting item:", error);
            setErrorMessage(error.message || "Error deleting item. Please try again.");
        } finally {
            // Auto-clear success/error messages after 5 seconds
            setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 5000);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Ongoing";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Format amount with currency
    const formatAmount = (amount) => {
        return `£${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <div className={styles.pageWrapper}>
            <AuthenticatedNavbar />
            
            <main className={styles.container}>
                <div className={styles.formWrapper}>
                    <header className={styles.headerTitle}>
                        Your Direct Debits & Subscriptions
                    </header>
                    
                    {successMessage && (
                        <div className={styles.successMessage}>
                            {successMessage}
                        </div>
                    )}
                    
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}
                    
                    {isLoading ? (
                        <div className={styles.loadingState}>
                            Loading your payment items...
                        </div>
                    ) : directDebits.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>You don't have any direct debits or subscriptions yet.</p>
                            <button 
                                className={styles.primaryButton}
                                onClick={() => window.location.href = '/financial-forms'}
                            >
                                Add New Item
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.tableContainer}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Amount</th>
                                            <th>Frequency</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {directDebits.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.Name}</td>
                                                <td className={styles.amountCell}>{formatAmount(item.Amount)}</td>
                                                <td>{item.Recurrance}</td>
                                                <td>{formatDate(item.Start_date)}</td>
                                                <td>{formatDate(item.End_Date)}</td>
                                                <td>
                                                    {showConfirmDelete === item.id ? (
                                                        <div className={styles.confirmDeleteActions}>
                                                            <span>Confirm?</span>
                                                            <button 
                                                                className={styles.deleteButton}
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                Yes
                                                            </button>
                                                            <button 
                                                                className={styles.cancelButton}
                                                                onClick={() => setShowConfirmDelete(null)}
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            className={styles.deleteButton}
                                                            onClick={() => setShowConfirmDelete(item.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className={styles.buttonGroup} style={{ marginTop: '20px' }}>
                                <Link to="/financial-forms">
                                    <button className={styles.submitButton}>
                                        Add New Item
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default DirectDebitsList;