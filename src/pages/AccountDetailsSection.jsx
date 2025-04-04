import React from "react";
import styles from "../Features/AccountDetailsComponents/Settings.module.css";
import AccountDetail from "../Features/AccountDetailsComponents/AccountDetail.jsx";

function AccountDetailsSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Account Details</h2>
            <div className={styles.cardGrid}>
                <AccountDetail
                    icon="😊"
                    title="Username"
                    value="Your current username"
                />
                <AccountDetail
                    icon="📧"
                    title="Email"
                    value="your.email@example.com"
                />
                <AccountDetail
                    icon="🔒"
                    title="Change Password"
                    value="Click here to change your password"
                    isSubdued
                />
            </div>
        </section>
    );
}

export default AccountDetailsSection;
