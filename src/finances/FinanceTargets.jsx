import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../auth/Client.js';
import styles from './FinanceTargets.module.css'; 
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";
import InputField2 from "./InputField2.jsx"; 

function FinanceTargets() {
    const navigate = useNavigate();
    
    // State for user and form data
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Form data state for new target
    const [targetData, setTargetData] = useState({
        name: '',
        goal: '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: '',
        currentCompletion: '0'
    });

    // State for contribution
    const [contributionData, setContributionData] = useState({
        targetId: '',
        amount: ''
    });

    // Fetch current user on component mount
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

    // Fetch existing targets
    const [targets, setTargets] = useState([]);
    useEffect(() => {
        async function fetchTargets() {
            if (!userId) return;

            try {
                const { data, error } = await supabaseClient
                    .from('Targets')
                    .select('*')
                    .eq('User_id', userId);

                if (error) throw error;

                setTargets(data || []);
            } catch (err) {
                console.error('Error fetching targets:', err);
                setError(err.message || 'Failed to fetch targets');
            }
        }

        fetchTargets();
    }, [userId]);

    // Handle input changes for new target
    const handleTargetChange = (e) => {
        const { name, value } = e.target;
        setTargetData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle input changes for contribution
    const handleContributionChange = (e) => {
        const { name, value } = e.target;
        setContributionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission for new target
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset messages
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // Validate inputs
        if (!userId) {
            setError("You must be logged in to add a financial target");
            setIsLoading(false);
            return;
        }

        if (!targetData.name || !targetData.goal) {
            setError("Please fill in all required fields");
            setIsLoading(false);
            return;
        }

        try {
            // Prepare submission data
            const submitData = {
                User_id: userId,
                Name: targetData.name,
                Goal: parseFloat(targetData.goal),
                Start_date: targetData.startDate,
                Target_date: targetData.targetDate,
                Current_completion: 0 // Start at 0
            };

            // Insert target
            const { data, error } = await supabaseClient
                .from('Targets')
                .insert([submitData]);

            if (error) throw error;

            // Update local state
            setTargets(prev => [...prev, submitData]);

            // Reset form
            setTargetData({
                name: '',
                goal: '',
                startDate: new Date().toISOString().split('T')[0],
                targetDate: '',
                currentCompletion: '0'
            });

            setSuccessMessage("Financial target added successfully!");
        } catch (err) {
            console.error('Error adding target:', err);
            setError(err.message || "Error adding financial target. Please try again.");
        } finally {
            setIsLoading(false);

            // Auto-clear messages
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 5000);
        }
    };

    // Handle adding contribution to a target
    const handleAddContribution = async (e) => {
        e.preventDefault();
        
        // Reset messages
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // Validate inputs
        if (!contributionData.targetId || !contributionData.amount) {
            setError("Please select a target and enter an amount");
            setIsLoading(false);
            return;
        }

        try {
            // Find the selected target
            const selectedTarget = targets.find(t => t.id === parseInt(contributionData.targetId));
            
            if (!selectedTarget) {
                throw new Error("Selected target not found");
            }

            // Calculate new completion amount
            const contributionAmount = parseFloat(contributionData.amount);
            const newCompletion = Math.min(
                selectedTarget.Current_completion + contributionAmount, 
                selectedTarget.Goal
            );

            // Update target in database
            const { data, error } = await supabaseClient
                .from('Targets')
                .update({ Current_completion: newCompletion })
                .eq('id', contributionData.targetId)
                .select();

            if (error) throw error;

            // Update local state
            setTargets(prev => prev.map(target => 
                target.id === parseInt(contributionData.targetId)
                    ? {...target, Current_completion: newCompletion}
                    : target
            ));

            // Reset contribution form
            setContributionData({
                targetId: '',
                amount: ''
            });

            setSuccessMessage("Contribution added successfully!");
        } catch (err) {
            console.error('Error adding contribution:', err);
            setError(err.message || "Error adding contribution. Please try again.");
        } finally {
            setIsLoading(false);

            // Auto-clear messages
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 5000);
        }
    };

    // Calculate progress percentage
    const calculateProgress = (current, goal) => {
        return Math.min(Math.round((current / goal) * 100), 100);
    };

    return (
        <div className={styles.pageWrapper}>
            <AuthenticatedNavbar />
            
            <main className={styles.container}>
                <div className={styles.formWrapper}>
                    {successMessage && (
                        <div className={styles.successMessage}>
                            {successMessage}
                        </div>
                    )}
                    
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {/* New Target Section */}
                    <section className={styles.formSection}>
                        <header className={styles.headerTitle}>Add Financial Target</header>
                        <form className={styles.formContent} onSubmit={handleSubmit}>
                            <InputField2
                                label="Target Name"
                                placeholder="What are you saving for?"
                                type="text"
                                name="name"
                                value={targetData.name}
                                onChange={handleTargetChange}
                                required
                            />
                            <InputField2
                                label="Goal Amount" 
                                placeholder="Enter target amount" 
                                type="number"
                                name="goal"
                                step="0.01"
                                min="0"
                                value={targetData.goal}
                                onChange={handleTargetChange}
                                required
                            />
                            <InputField2 
                                label="Start Date" 
                                type="date"
                                name="startDate"
                                value={targetData.startDate}
                                onChange={handleTargetChange}
                                required
                            />
                            <InputField2 
                                label="Target Date" 
                                type="date"
                                name="targetDate"
                                value={targetData.targetDate}
                                onChange={handleTargetChange}
                                required
                            />

                            <div className={styles.buttonGroup}>
                                <button 
                                    type="button" 
                                    className={styles.cancelButton}
                                    onClick={() => setTargetData({
                                        name: '',
                                        goal: '',
                                        startDate: new Date().toISOString().split('T')[0],
                                        targetDate: '',
                                        currentCompletion: '0'
                                    })}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.submitButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Adding..." : "Add Target"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Add Contribution Section */}
                    <section className={styles.formSection}>
                        <header className={styles.headerTitle}>Add Contribution</header>
                        <form className={styles.formContent} onSubmit={handleAddContribution}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="targetId" className={styles.inputLabel}>
                                    Select Target
                                </label>
                                <select
                                    id="targetId"
                                    name="targetId"
                                    value={contributionData.targetId}
                                    onChange={handleContributionChange}
                                    className={styles.inputField}
                                    required
                                >
                                    <option value="">Choose a target</option>
                                    {targets.map((target) => (
                                        <option key={target.id} value={target.id}>
                                            {target.Name} (Goal: £{target.Goal.toFixed(2)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <InputField2
                                label="Contribution Amount" 
                                placeholder="Enter contribution amount" 
                                type="number"
                                name="amount"
                                step="0.01"
                                min="0"
                                value={contributionData.amount}
                                onChange={handleContributionChange}
                                required
                            />

                            <div className={styles.buttonGroup}>
                                <button 
                                    type="button" 
                                    className={styles.cancelButton}
                                    onClick={() => setContributionData({
                                        targetId: '',
                                        amount: ''
                                    })}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.submitButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Adding..." : "Add Contribution"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Targets Display Section */}
                    <section className={styles.targetsSection}>
                        <header className={styles.headerTitle}>Your Financial Targets</header>
                        {targets.length === 0 ? (
                            <p>No targets yet. Create your first target!</p>
                        ) : (
                            targets.map((target) => (
                                <div key={target.id} className={styles.targetCard}>
                                    <h3>{target.Name}</h3>
                                    <p>Goal: £{target.Goal.toFixed(2)}</p>
                                    <p>Start Date: {new Date(target.Start_date).toLocaleDateString()}</p>
                                    <p>Target Date: {new Date(target.Target_date).toLocaleDateString()}</p>
                                    
                                    <div className={styles.progressContainer}>
                                        <div 
                                            className={styles.progressBar}
                                            style={{
                                                width: `${calculateProgress(target.Current_completion, target.Goal)}%`
                                            }}
                                        ></div>
                                    </div>
                                    
                                    <p className={styles.progressText}>
                                        {calculateProgress(target.Current_completion, target.Goal)}%
                                        ({target.Current_completion.toFixed(2)} / {target.Goal.toFixed(2)})
                                    </p>
                                </div>
                            ))
                        )}
                    </section>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default FinanceTargets;