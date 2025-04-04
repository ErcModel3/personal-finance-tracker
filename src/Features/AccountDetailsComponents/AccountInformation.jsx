import React from "react";
import styles from "./Settings.module.css";
import AccountDetailsSection from "../../pages/AccountDetailsSection.jsx";
import NotificationSettings from "./NotificationSettings.jsx";
import DeleteAccount from "./DeleteAccount.jsx";
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";

function AccountInformation() {
    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Account Information</h1>
                <p className={styles.subtitle}>View and update your account details</p>
            </header>
            <Navbar/>
            <AccountDetailsSection />
            <NotificationSettings />
            <DeleteAccount />
            <Footer />
        </main>
    );
}

export default AccountInformation;
