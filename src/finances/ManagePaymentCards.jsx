import React, { useState, useEffect } from 'react';

// Import Components
import styles from "../Styles.module.css";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";
import supabaseClient from "../auth/Client.js";
import userID from "../auth/SessionData.js";

const ManageBankCards = () => {

    // State for the cards
    const [bankCards, setBankCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);


    useEffect(() => {
        console.log("useEffect running");

        const fetchCards = async () => {
            console.log("Fetching user cards...");

            // Get the current session
            const sessionID = userID

            // Query the profiles table using the user ID from the session
            const { data, error } = await supabaseClient
                .from('Bank_Cards')
                .select('*') // Select all columns to see what's available
                .eq('User_id', sessionID);

            if (error) {
                console.log('Card fetch error:', error);
                setLoading(false);
                return;
            }

            console.log("Card data received:", data);

            // Set the bankCards state with the fetched data
            setBankCards(data || []);
            setLoading(false);
        };

        fetchCards().then(r => null); //ibr idk what the .then does but webstorm told me i should do it so the promise is kept
    }, []);

    // Handle editing a card
    const handleEditCard = (card) => {
        // Store the card with an additional field for the original bank name
        setSelectedCard({
            ...card, //copies all data from card into this JSON
            originalBankName: card.Bank_name
        });
        console.log(`Editing card:`, JSON.stringify(card, null, 2));
    };

    const handleSaveEdit = async () => {
        if (!selectedCard.Bank_name.trim()) {
            alert("Bank name cannot be empty");
            return;
        }

        // Get the current user's ID
        const sessionID = userID;

        // Update the card in the database using the original name as identifier
        const { error } = await supabaseClient
            .from('Bank_Cards')
            .update({
                Bank_name: selectedCard.Bank_name
            })
            .eq('User_id', sessionID)
            .eq('Bank_name', selectedCard.originalBankName);

        if (error) {
            console.error('Error updating card:', error);
            alert('Failed to update card: ' + error.message);
            return;
        }

        // Update the local state
        setBankCards(bankCards.map(card =>
            card.Bank_name === selectedCard.originalBankName ?
                {...card, Bank_name: selectedCard.Bank_name} :
                card
        ));

        console.log(`Saved edited card:`, JSON.stringify(selectedCard, null, 2));

        setSelectedCard(null);
    };

    const handleDeleteCard = async (card) => {
        if (window.confirm("Are you sure you want to delete this card?")) {
            console.log(`Deleting card with name: ${card.Bank_name}`);

            // Get the current user's ID
            const sessionID = userID;

            // Delete from the database matching both Bank_name and User_id
            const { error } = await supabaseClient
                .from('Bank_Cards')
                .delete()
                .eq('Bank_name', card.Bank_name)
                .eq('User_id', sessionID);

            if (error) {
                console.error('Error deleting card:', error);
                alert('Failed to delete card: ' + error.message);
                return;
            }

            // If the delete operation was successful, update the UI
            // Filter out the card with the matching Bank_name
            setBankCards(bankCards.filter(c => c.Bank_name !== card.Bank_name));

            console.log('Card deleted successfully');
        }
    };

    return (
        <div className={styles.app}>
            <AuthenticatedNavbar />
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
                                                onClick={() => handleDeleteCard(card)}
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