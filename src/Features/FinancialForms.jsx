import React, { useState, useEffect } from "react";
import styles from "./DirectDebitForm.module.css";
import { InputField } from "./InputField.jsx";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";
import supabaseClient from "../auth/Client.js";

function FinancialForms() {
    // State for form selection (Direct Debit or Subscription)
    const [activeForm, setActiveForm] = useState("directDebit");
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    // State for form data
    const [directDebitData, setDirectDebitData] = useState({
        companyName: "",
        amount: "",
        startDate: new Date().toISOString().split('T')[0],
        recurrence: "Monthly",
        endDate: ""
    });
    
    const [subscriptionData, setSubscriptionData] = useState({
        serviceName: "",
        cost: "",
        startDate: new Date().toISOString().split('T')[0],
        recurrence: "Monthly",
        endDate: ""
    });
    
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
    
    // Handle input changes for Direct Debit form
    const handleDirectDebitChange = (e) => {
        const { name, value } = e.target;
        setDirectDebitData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle input changes for Subscription form
    const handleSubscriptionChange = (e) => {
        const { name, value } = e.target;
        setSubscriptionData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle direct debit form submission
    const handleDirectDebitSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            setErrorMessage("You must be logged in to add a direct debit");
            return;
        }
        
        if (!directDebitData.companyName || !directDebitData.amount) {
            setErrorMessage("Please fill in all required fields");
            return;
        }
        
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        
        try {
            // Form data object with proper casing to match database schema
            const submitData = {
                Userid: userId,
                Name: directDebitData.companyName,
                Start_date: directDebitData.startDate,
                Recurrance: directDebitData.recurrence,
                Amount: parseFloat(directDebitData.amount),
                End_Date: directDebitData.endDate || null
            };
            
            // Insert data into the Direct_Debits table
            const { data, error } = await supabaseClient
                .from('Direct_Debits')
                .insert([submitData]);
                
            if (error) {
                throw error;
            }
            
            // Clear form and show success message
            setDirectDebitData({
                companyName: "",
                amount: "",
                startDate: new Date().toISOString().split('T')[0],
                recurrence: "Monthly",
                endDate: ""
            });
            
            setSuccessMessage("Direct debit added successfully!");
        } catch (error) {
            console.error("Error adding direct debit:", error);
            setErrorMessage(error.message || "Error adding direct debit. Please try again.");
        } finally {
            setIsLoading(false);
            
            // Auto-clear success/error messages after 5 seconds
            setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 5000);
        }
    };
    
    // Handle subscription form submission
    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            setErrorMessage("You must be logged in to add a subscription");
            return;
        }
        
        if (!subscriptionData.serviceName || !subscriptionData.cost) {
            setErrorMessage("Please fill in all required fields");
            return;
        }
        
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        
        try {
            // Form data object with proper casing to match database schema
            const submitData = {
                Userid: userId,
                Name: subscriptionData.serviceName,
                Start_date: subscriptionData.startDate,
                Recurrance: subscriptionData.recurrence,
                Amount: parseFloat(subscriptionData.cost),
                End_Date: subscriptionData.endDate || null
            };
            
            // Insert data into the Direct_Debits table
            const { data, error } = await supabaseClient
                .from('Direct_Debits')
                .insert([submitData]);
                
            if (error) {
                throw error;
            }
            
            // Clear form and show success message
            setSubscriptionData({
                serviceName: "",
                cost: "",
                startDate: new Date().toISOString().split('T')[0],
                recurrence: "Monthly",
                endDate: ""
            });
            
            setSuccessMessage("Subscription added successfully!");
        } catch (error) {
            console.error("Error adding subscription:", error);
            setErrorMessage(error.message || "Error adding subscription. Please try again.");
        } finally {
            setIsLoading(false);
            
            // Auto-clear success/error messages after 5 seconds
            setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 5000);
        }
    };
    
    // Recurrence options
    const recurrenceOptions = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
    
    return (
        <div className={styles.pageWrapper}>
            <AuthenticatedNavbar />
            
            <main className={styles.container}>
                <div className={styles.formWrapper}>
                    <div className={styles.tabSelector}>
                        <button 
                            className={`${styles.tabButton} ${activeForm === "directDebit" ? styles.activeTab : ""}`}
                            onClick={() => setActiveForm("directDebit")}
                        >
                            Direct Debit
                        </button>
                        <button 
                            className={`${styles.tabButton} ${activeForm === "subscription" ? styles.activeTab : ""}`}
                            onClick={() => setActiveForm("subscription")}
                        >
                            Subscription
                        </button>
                    </div>
                    
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
                    
                    {activeForm === "directDebit" ? (
                        <section className={styles.formSection}>
                            <header className={styles.headerTitle}>Add Direct Debit</header>
                            <form className={styles.formContent} onSubmit={handleDirectDebitSubmit}>
                                <InputField
                                    label="Company Name"
                                    placeholder="Enter company name"
                                    type="text"
                                    name="companyName"
                                    value={directDebitData.companyName}
                                    onChange={handleDirectDebitChange}
                                    required
                                />
                                <InputField 
                                    label="Amount" 
                                    placeholder="Enter amount" 
                                    type="number"
                                    name="amount"
                                    step="0.01"
                                    min="0"
                                    value={directDebitData.amount}
                                    onChange={handleDirectDebitChange}
                                    required
                                />
                                <InputField 
                                    label="Start Date" 
                                    type="date"
                                    name="startDate"
                                    value={directDebitData.startDate}
                                    onChange={handleDirectDebitChange}
                                    required
                                />
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Recurrence</label>
                                    <select 
                                        className={styles.inputField}
                                        name="recurrence"
                                        value={directDebitData.recurrence}
                                        onChange={handleDirectDebitChange}
                                    >
                                        {recurrenceOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <InputField 
                                    label="End Date (Optional)" 
                                    type="date"
                                    name="endDate"
                                    value={directDebitData.endDate}
                                    onChange={handleDirectDebitChange}
                                />
                                <div className={styles.buttonGroup}>
                                    <button 
                                        type="button" 
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setDirectDebitData({
                                                companyName: "",
                                                amount: "",
                                                startDate: new Date().toISOString().split('T')[0],
                                                recurrence: "Monthly",
                                                endDate: ""
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className={styles.submitButton}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Adding..." : "Add Direct Debit"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    ) : (
                        <section className={styles.formSection}>
                            <header className={styles.headerTitle}>Add Subscription Details</header>
                            <form className={styles.formContent} onSubmit={handleSubscriptionSubmit}>
                                <InputField
                                    label="Service Name"
                                    placeholder="Enter service name"
                                    type="text"
                                    name="serviceName"
                                    value={subscriptionData.serviceName}
                                    onChange={handleSubscriptionChange}
                                    required
                                />
                                <InputField 
                                    label="Cost" 
                                    placeholder="Enter cost" 
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="cost"
                                    value={subscriptionData.cost}
                                    onChange={handleSubscriptionChange}
                                    required
                                />
                                <InputField 
                                    label="Start Date" 
                                    type="date"
                                    name="startDate"
                                    value={subscriptionData.startDate}
                                    onChange={handleSubscriptionChange}
                                    required
                                />
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Recurrence</label>
                                    <select 
                                        className={styles.inputField}
                                        name="recurrence"
                                        value={subscriptionData.recurrence}
                                        onChange={handleSubscriptionChange}
                                    >
                                        {recurrenceOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <InputField 
                                    label="End Date (Optional)" 
                                    type="date"
                                    name="endDate"
                                    value={subscriptionData.endDate}
                                    onChange={handleSubscriptionChange}
                                />
                                <div className={styles.buttonGroup}>
                                    <button 
                                        type="button" 
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setSubscriptionData({
                                                serviceName: "",
                                                cost: "",
                                                startDate: new Date().toISOString().split('T')[0],
                                                recurrence: "Monthly",
                                                endDate: ""
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className={styles.submitButton}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Adding..." : "Add Subscription"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default FinancialForms;