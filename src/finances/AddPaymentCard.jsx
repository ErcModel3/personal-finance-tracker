import React, { useState } from 'react';

// Import Components
import styles from "../Styles.module.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import supabaseClient from "../auth/Client.js";

const AddPaymentCard = () => {
    // State for form inputs - matching database schema
    const [bankName, setBankName] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Get user session. all this session checking should be deleted, this page will be in the session wrapper, so you couldn't even access this page without a valid session.
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

            if (sessionError || !session) {
                console.error("Session error:", sessionError);
                alert("Authentication error. Please sign in again.");
                return;
            }

            const sessionUser = session.user.id;

            if (!bankName.trim()) {
                alert("Please enter a Bank Name");
                return;
            }

            // Creating the card
            const cardData = {
                User_id: sessionUser,
                Bank_name: bankName.trim()
            };

            // Insert into database
            const { data, error } = await supabaseClient
                .from('Bank_Cards')
                .insert(cardData)
                .select();

            if (error) {
                console.error("Database error:", error);
                alert("Error saving card: " + error.message);
                return;
            }

            console.log("Response data:", data);

            if (data && data.length > 0) {
                // Show a success message
                alert("Card saved successfully!");
                // Reset form
                setBankName('');
            } else {
                console.warn("No data returned after insert");
                alert("Card may have been created but couldn't be verified.");
                setBankName('');
            }
        } catch (err) {
            alert("An unexpected error occurred: " + err.message);
        }
    };

    // Cancel button code
    const handleCancel = () => {
        // Reset form
        setBankName('');
    };

    return (
        <div className={styles.app}>
            <Navbar />
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h1 className={styles.metricsTitle}>Add New Bank Card</h1>
                    <p className={styles.metricsDescription}>Enter your bank card details below.</p>
                </div>

                <div className={styles.chartContainer}>
                    <div style={{ padding: '20px' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Bank Name</div>
                            <input
                                type="text"
                                placeholder="Enter bank name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={handleCancel}
                                className={styles.primaryButton}
                                style={{
                                    flex: 1,
                                    maxWidth: '45%',
                                    margin: '0',
                                    backgroundColor: '#6c757d'
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
                                Save Card
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddPaymentCard;