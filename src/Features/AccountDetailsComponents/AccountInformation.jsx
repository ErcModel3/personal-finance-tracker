import React from "react";
import styles from "./Settings.module.css";
import AccountDetailsSection from "../../pages/AccountDetailsSection.jsx";
import NotificationSettings from "./NotificationSettings.jsx";
import DeleteAccount from "./DeleteAccount.jsx";
import Footer from "../../components/Footer.jsx";
import AuthenticatedNavbar from "../../components/AuthenticatedNavbar.jsx";

function AccountInformation() {
    return (
        <main className={styles.compactContainer}>
            <header className={styles.compactHeader}>
                <h1 className={styles.compactTitle}>Account Information</h1>
                <p className={styles.compactSubtitle}>View and update your account details</p>
            </header>
            <AuthenticatedNavbar/>
            <div className={styles.contentGrid}>
                <AccountDetailsSection />
                <NotificationSettings />
                <DeleteAccount />
            </div>
            <Footer />
        </main>
    );
}

export default AccountInformation;