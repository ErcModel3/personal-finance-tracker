import React from "react";
import styles from "../Features/AccountDetailsComponents/Settings.module.css";
import AccountDetail from "../Features/AccountDetailsComponents/AccountDetail.jsx";

function AccountDetailsSection() {
    const handlePasswordClick = () => {
        // Database integration
        alert("Password change functionality will be implemented here.");

    };

    const userData = {
        username: "Username will be displayed here",
        email: "user@example.com"
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Account Details</h2>
            <div className={styles.cardGrid}>
                <AccountDetail
                    title="Username"
                    value={userData.username}
                />
                <AccountDetail
                    title="Email"
                    value={userData.email}
                />
                <AccountDetail
                    title="Password Management"
                    value={
                        <button
                            className={styles.passwordChangeButton}
                            onClick={handlePasswordClick}
                        >
                            Change Password
                        </button>
                    }
                />
            </div>
        </section>
    );
}

export default AccountDetailsSection;