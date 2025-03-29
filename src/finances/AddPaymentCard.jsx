import React, { useState } from 'react';

// Import Components
import styles from "../Styles.module.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const AddPaymentCard = () => {
    // State for form inputs - matching database schema
    const [bankName, setBankName] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!bankName.trim()) {
            alert("Please enter a Bank Name");
            return;
        }

        // Creating the card
        const cardData = {
            // TO DO add integration with the wrapper to get the user ID
            Bank_name: bankName.trim()
        };

        // Log to console as JSON
        console.log("New card data:");
        console.log(JSON.stringify(cardData, null, 2));

        // Reset form
        setBankName('');

        // Show a success message
        alert("Card saved successfully!");
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