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
    const [salaryRecord, setSalaryRecord] = useState(null);

    // Custom styles for the green button
    const greenButtonStyle = {
        backgroundColor: '#27AE60',
        color: 'white',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        width: '100%',
        marginTop: '20px'
    };
    
    // Fetch the current user and their salary on component mount
    useEffect(() => {
        const fetchUserAndSalary = async () => {
            try {
                // Get the user ID from the session
                const userId = await userID;
                
                if (userId) {
                    setUser(userId);
                    
                    // Check if the user has a salary record already
                    const { data, error: salaryError } = await supabaseClient
                        .from('Monthly_Salary')
                        .select('*')
                        .eq('userID', userId)
                        .single();
                    
                    if (salaryError && salaryError.code !== 'PGRST116') { // PGRST116 is "no rows found"
                        throw salaryError;
                    }
                    
                    if (data) {
                        setSalaryRecord(data);
                        setCurrentSalary(data.Salary);
                        setMonthlySalary(data.Salary.toString());
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
        const sessionID = await userID;

        try {
            let result;
            
            if (salaryRecord) {
                // Update existing salary record
                result = await supabaseClient
                    .from('Monthly_Salary')
                    .update({ 
                        Salary: parseFloat(monthlySalary)
                    })
                    .eq('userID', sessionID);
            } else {
                // Create new salary record
                result = await supabaseClient
                    .from('Monthly_Salary')
                    .insert([{ 
                        userID: sessionID,
                        Salary: parseFloat(monthlySalary)
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
                            <p>Your current monthly salary: <strong>£{currentSalary.toFixed(2)}</strong></p>
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
                                style={greenButtonStyle}
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