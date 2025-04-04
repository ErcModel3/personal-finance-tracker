import React, { useState, useEffect } from 'react';

// Import Components
import styles from "../Styles.module.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const ManageBankCards = () => {

    // State for the cards
    const [bankCards, setBankCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);


    useEffect(() => {

        // Adding testing data (same way the db would work)
        setTimeout(() => {
            const mockCards = [
                { id: 1, User_id: "1", Bank_name: "Starling" },
                { id: 2, User_id: "1", Bank_name: "Monzo"},
                { id: 3, User_id: "1", Bank_name: "American Express" }
            ];
            setBankCards(mockCards); // TO DO replace with db card data structure
            setLoading(false); // TO DO change to true ^
        }, 500);

        // TO DO Add db code in place of this function
    }, []);

    // Handle editing a card
    const handleEditCard = (card) => {
        setSelectedCard(card);
        console.log(`Editing card:`, JSON.stringify(card, null, 2));
    };

    const handleSaveEdit = () => {
        if (!selectedCard.Bank_name.trim()) {
            alert("Bank name cannot be empty");
            return;
        }
        setBankCards(bankCards.map(card =>
            card.id === selectedCard.id ? selectedCard : card
        ));

        console.log(`Saved edited card:`, JSON.stringify(selectedCard, null, 2));

        // TO DO add db code to edit the selected card

        setSelectedCard(null);
    };

    const handleDeleteCard = (cardId) => {
        if (window.confirm("Are you sure you want to delete this card?")) {
            console.log(`Deleting card with ID: ${cardId}`);

            // Filter out the deleted card from the card states
            setBankCards(bankCards.filter(card => card.id !== cardId));

            // TO DO add db code to delete the card from the user
        }
    };

    return (
        <div className={styles.app}>
            <Navbar />
            <div className={styles.metricsSection}>
                <div className={styles.metricsHeader}>
                    <h1 className={styles.metricsTitle}>Manage Bank Cards</h1>
                    <p className={styles.metricsDescription}>View and manage your connected bank cards.</p>
                </div>

                <div className={styles.chartContainer}>
                    {loading ? (
                        <div className={styles.loadingState}>Loading your cards...</div>
                    ) : bankCards.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>You don't have any cards yet, please add a new card below.</p>
                            <button
                                className={styles.primaryButton}
                                onClick={() => window.location.href = '/add-card'}
                            >
                                Add New Card
                            </button>
                        </div>
                    ) : (
                        <div className={styles.cardListContainer}>
                            <h3 className={styles.sectionSubheader}>Your Bank Cards</h3>

                            <div className={styles.cardList}>
                                {bankCards.map(card => (
                                    <div key={card.id} className={styles.cardItem}>
                                        <div className={styles.cardDetails}>
                                            <div className={styles.cardName}>{card.Bank_name}</div>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button
                                                onClick={() => handleEditCard(card)}
                                                // TO DO make function
                                                className={styles.editButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCard(card.id)}
                                                className={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.addCardButtonContainer}>
                                <button
                                    className={styles.primaryButton}
                                    onClick={() => window.location.href = '/add-card'}
                                >
                                    Add New Card
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* The Modal element for editing a card */}
                {selectedCard && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3 className={styles.modalTitle}>Edit Bank Card</h3>

                            <div className={styles.formGroup}>
                                <div className={styles.formLabel}>User ID</div>
                                <input
                                    type="text"
                                    value={selectedCard.User_id}
                                    disabled
                                    className={styles.formInputDisabled}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.formLabel}>Bank Name</div>
                                <input
                                    type="text"
                                    value={selectedCard.Bank_name}
                                    onChange={(e) => setSelectedCard({...selectedCard, Bank_name: e.target.value})}
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    onClick={() => setSelectedCard(null)}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className={styles.primaryButton}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageBankCards;