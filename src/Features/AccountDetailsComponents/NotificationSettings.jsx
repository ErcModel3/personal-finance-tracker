import React from "react";
import styles from "./Settings.module.css";
import NotificationInSettings from "./NotificationInSettings.jsx";

function NotificationSettings() {
    return (
        <section className={styles.compactSection}>
            <h2 className={styles.sectionTitle}>Notifications Settings</h2>
            <p className={styles.sectionDescription}>Manage your notification preferences</p>
            <div className={styles.notificationContainer}>
                <NotificationInSettings
                    title="Email Notifications"
                    description="Receive email notifications for updates"
                />
                <NotificationInSettings
                    title="Push Notifications"
                    description="Receive push notifications on your device"
                />
            </div>
        </section>
    );
}

export default NotificationSettings;