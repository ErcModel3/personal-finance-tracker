import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../Styles.module.css";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";
import supabaseClient from "../auth/Client.js";
import userID from "../auth/SessionData.js";

function MonthlySalary() {
    const navigate = useNavigate();
    const [monthlySalary, setMonthlySalary] = useState('');
    const [currentSalary, setCurrentSalary] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Fetch the current user and their salary on component mount
    useEffect(() => {
        const fetchUserAndSalary = async () => {
            try {
                // Get the user ID from the session
                const userId = await userID;
                
                if (userId) {
                    setUser(userId);
                    
                    // Check if the user has a salary already
                    const { data, error: profileError } = await supabaseClient
                        .from('profiles')
                        .select('monthly_salary')
                        .eq('auth_user_id', userId)
                        .single();
                    
                    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows found"
                        throw profileError;
                    }
                    
                    if (data && data.monthly_salary) {
                        setCurrentSalary(data.monthly_salary);
                        setMonthlySalary(data.monthly_salary.toString());
                    }
                } else {
                    // Redirect to login if no user is found
                    navigate('/signin');
                }
            } catch (err) {
                console.error("Error fetching user or salary:", err);
                setError("Failed to load your information. Please try again.");
            }
        };
        
        fetchUserAndSalary();
    }, [navigate]);

    const handleChange = (e) => {
        setMonthlySalary(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        if (!user) {
            setError("You must be logged in to set your salary information.");
            setLoading(false);
            return;
        }

        try {
            // Check if profile exists
            const { data: existingProfile, error: profileCheckError } = await supabaseClient
                .from('profiles')
                .select('id')
                .eq('auth_user_id', user)
                .single();
                
            if (profileCheckError && profileCheckError.code !== 'PGRST116') {
                throw profileCheckError;
            }
            
            let result;
            
            if (existingProfile) {
                // Update existing profile with the new salary
                result = await supabaseClient
                    .from('profiles')
                    .update({ monthly_salary: parseFloat(monthlySalary) })
                    .eq('auth_user_id', user);
            } else {
                // Create new profile with the salary
                result = await supabaseClient
                    .from('profiles')
                    .insert([{ 
                        auth_user_id: user,
                        monthly_salary: parseFloat(monthlySalary)
                    }]);
            }
            
            if (result.error) throw result.error;
            
            setCurrentSalary(parseFloat(monthlySalary));
            setSubmitted(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError("Failed to save your salary information: " + err.message);
            console.error("Error saving salary data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthenticatedNavbar />
            <div className={styles.pageContainer}>
                <div className={styles.formContainer}>
                    <h1 className={styles.pageTitle}>
                        {currentSalary ? 'Update Your Monthly Salary' : 'Set Your Monthly Salary'}
                    </h1>
                    
                    {currentSalary && (
                        <div className={styles.currentSalaryInfo}>
                            <p>Your current monthly salary: <strong>${currentSalary.toFixed(2)}</strong></p>
                        </div>
                    )}
                    
                    <p className={styles.pageDescription}>
                        {currentSalary 
                            ? 'You can update your monthly salary if it has changed.'
                            : 'Please set your monthly salary to help us personalize your budget recommendations.'}
                    </p>

                    {submitted ? (
                        <div className={styles.successMessage}>
                            <h3>Salary information saved successfully!</h3>
                            <p>Redirecting you to the dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="monthlySalary" className={styles.formLabel}>
                                    Monthly Salary
                                </label>
                                <input
                                    type="number"
                                    id="monthlySalary"
                                    name="monthlySalary"
                                    value={monthlySalary}
                                    onChange={handleChange}
                                    placeholder="Enter your monthly salary"
                                    className={styles.formInput}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            {error && <div className={styles.errorMessage}>{error}</div>}

                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={loading || !monthlySalary}
                            >
                                {loading ? 'Saving...' : (currentSalary ? 'Update Salary' : 'Save Salary')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MonthlySalary;