import React from "react";
import styles from "./StylesCheatsheet.module.css";

function WelcomePart() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h2 className={styles.heroTitle}>
                    Welcome to Your Budgeting Dashboard
                </h2>
                <p className={styles.heroDescription}>
                    Track your expenses and manage your budget effectively.
                </p>
                <button className={styles.primaryButton}>Get Started</button>
            </div>
        </section>
    );
}

export default WelcomePart;
