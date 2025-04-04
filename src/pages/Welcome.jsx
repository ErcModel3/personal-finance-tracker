import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Styles.module.css";

function Welcome() {
    
    const navigate = useNavigate();

 
    const handleGetStarted = () => {
        navigate("/signup");
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h2 className={styles.heroTitle}>
                    Welcome to Your Budgeting Dashboard
                </h2>
                <p className={styles.heroDescription}>
                    Track your expenses and manage your budget effectively.
                </p>
                <button 
                    className={styles.primaryButton} 
                    onClick={handleGetStarted}
                >
                    Get Started
                </button>
            </div>
        </section>
    );
}

export default Welcome;