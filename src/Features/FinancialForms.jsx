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
    const [debugMessage, setDebugMessage] = useState(""); // For visible debugging
    
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
        amount: "",
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
                    setDebugMessage("Error fetching user: " + error.message);
                    return;
                }
                
                if (data && data.user) {
                    setUserId(data.user.id);
                    setDebugMessage("User ID fetched: " + data.user.id.substring(0, 8) + "...");
                } else {
                    setDebugMessage("No user data returned");
                }
            } catch (e) {
                console.error("Exception in getCurrentUser:", e);
                setDebugMessage("Exception in getCurrentUser: " + e.message);
            }
        }
        
        getCurrentUser();
        
        // Simple debug message to confirm component mounted
        console.log("FinancialForms component mounted");
        setDebugMessage("Component mounted, checking user...");
    }, []);
    
    // Handle input changes for Direct Debit form
    const handleDirectDebitChange = (e) => {
        const { name, value } = e.target;
        console.log(`DD Input changed: ${name} = ${value}`);
        setDirectDebitData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle input changes for Subscription form
    const handleSubscriptionChange = (e) => {
        const { name, value } = e.target;
        console.log(`Sub Input changed: ${name} = ${value}`);
        setSubscriptionData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle button clicks directly as a test
    const handleTestButtonClick = () => {
        console.log("Test button clicked!");
        setDebugMessage("Test button clicked at " + new Date().toLocaleTimeString());
        alert("Button click detected!");
    };
    
    // Detailed validation function
    const validateDirectDebitForm = () => {
        console.log("Validating Direct Debit form with data:", directDebitData);
        
        const validationIssues = [];
        
        if (!directDebitData.companyName?.trim()) {
            validationIssues.push("Company Name is required");
            console.log("Company Name validation failed. Value:", directDebitData.companyName);
        }
        
        if (!directDebitData.amount) {
            validationIssues.push("Amount is required");
            console.log("Amount validation failed. Value:", directDebitData.amount);
        }
        
        if (!directDebitData.startDate) {
            validationIssues.push("Start Date is required");
            console.log("Start Date validation failed. Value:", directDebitData.startDate);
        }
        
        if (!directDebitData.recurrence) {
            validationIssues.push("Recurrence is required");
            console.log("Recurrence validation failed. Value:", directDebitData.recurrence);
        }
        
        return validationIssues;
    };
    
    // Detailed validation function for subscription
    const validateSubscriptionForm = () => {
        console.log("Validating Subscription form with data:", subscriptionData);
        
        const validationIssues = [];
        
        if (!subscriptionData.serviceName?.trim()) {
            validationIssues.push("Service Name is required");
            console.log("Service Name validation failed. Value:", subscriptionData.serviceName);
        }
        
        if (!subscriptionData.cost) {
            validationIssues.push("Cost is required");
            console.log("Cost validation failed. Value:", subscriptionData.cost);
        }
        
        if (!subscriptionData.startDate) {
            validationIssues.push("Start Date is required");
            console.log("Start Date validation failed. Value:", subscriptionData.startDate);
        }
        
        if (!subscriptionData.recurrence) {
            validationIssues.push("Recurrence is required");
            console.log("Recurrence validation failed. Value:", subscriptionData.recurrence);
        }
        
        return validationIssues;
    };
    
    // Handle direct debit form submission
    const handleDirectDebitSubmit = async (e) => {
        e.preventDefault();
        console.log("Direct Debit form submitted");
        setDebugMessage("Direct Debit form submitted at " + new Date().toLocaleTimeString());
        
        // Dump entire form state for debugging
        console.log("Current directDebitData state:", JSON.stringify(directDebitData, null, 2));
        
        if (!userId) {
            console.log("No user ID found");
            setErrorMessage("You must be logged in to add a direct debit");
            setDebugMessage("Error: No user ID found");
            return;
        }
        
        // Detailed validation
        const validationIssues = validateDirectDebitForm();
        if (validationIssues.length > 0) {
            console.log("Validation issues found:", validationIssues);
            setErrorMessage(`Please fill in all required fields: ${validationIssues.join(", ")}`);
            setDebugMessage(`Error: Missing fields - ${validationIssues.join(", ")}`);
            return;
        }
        
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        setDebugMessage("Processing direct debit submission...");
        
        try {
            const submitData = {
            Userid: userId,
            Name: directDebitData.companyName,
            Start_date: directDebitData.startDate,
            Recurrance: directDebitData.recurrence, // Note the "a" instead of "e"
            Amount: parseFloat(directDebitData.amount),
            End_Date: directDebitData.endDate || null
        };
            
            console.log("Submitting direct debit data:", submitData);
            setDebugMessage("Submitting to database...");
            
            // Insert data into the Direct_Debits table
            const { data, error } = await supabaseClient
                .from('Direct_Debits')
                .insert([submitData]);
                
            if (error) {
                console.error("Database error:", error);
                setDebugMessage("DB Error: " + error.message);
                throw error;
            }
            
            console.log("Insert response:", data);
            setDebugMessage("Success! Data inserted.");
            
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
            setDebugMessage("Exception: " + error.message);
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
        console.log("Subscription form submitted");
        setDebugMessage("Subscription form submitted at " + new Date().toLocaleTimeString());
        
        // Dump entire form state for debugging
        console.log("Current subscriptionData state:", JSON.stringify(subscriptionData, null, 2));
        
        if (!userId) {
            console.log("No user ID found");
            setErrorMessage("You must be logged in to add a subscription");
            setDebugMessage("Error: No user ID found");
            return;
        }
        
        // Detailed validation
        const validationIssues = validateSubscriptionForm();
        if (validationIssues.length > 0) {
            console.log("Validation issues found:", validationIssues);
            setErrorMessage(`Please fill in all required fields: ${validationIssues.join(", ")}`);
            setDebugMessage(`Error: Missing fields - ${validationIssues.join(", ")}`);
            return;
        }
        
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        setDebugMessage("Processing subscription submission...");
        
        try {
            // Form simple debug data object
            const submitData = {
                Userid: userId,
                Name: subscriptionData.serviceName,
                Start_date: subscriptionData.startDate,
                Recurrance: subscriptionData.recurrence,
                Amount: parseFloat(subscriptionData.cost),
                End_Date: subscriptionData.endDate || null
            };
            
            console.log("Submitting subscription data:", submitData);
            setDebugMessage("Submitting to database...");
            
            // Insert data into the Direct_Debits table
            const { data, error } = await supabaseClient
                .from('Direct_Debits')
                .insert([submitData]);
                
            if (error) {
                console.error("Database error:", error);
                setDebugMessage("DB Error: " + error.message);
                throw error;
            }
            
            console.log("Insert response:", data);
            setDebugMessage("Success! Data inserted.");
            
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
            setDebugMessage("Exception: " + error.message);
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
                    
                    {/* Debug message display */}
                    {debugMessage && (
                        <div className={styles.debugMessage}>
                            Debug: {debugMessage}
                        </div>
                    )}
                    
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
                    
                    {/* Test button */}
                    <button 
                        type="button"
                        className={styles.testButton}
                        onClick={handleTestButtonClick}
                    >
                        Test Button (Click Me)
                    </button>
                    
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
                                            console.log("Cancel button clicked");
                                            setDebugMessage("Form canceled and reset");
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
                                            console.log("Cancel button clicked");
                                            setDebugMessage("Form canceled and reset");
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