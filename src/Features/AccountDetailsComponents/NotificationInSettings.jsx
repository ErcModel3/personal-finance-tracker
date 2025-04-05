import React from "react";
import styles from "./Settings.module.css";

function NotificationInSettings({ title, description }) {
    return (
        <article className={styles.notificationCard}>
            <div className={styles.notificationContent}>
                <h3 className={styles.notificationTitle}>{title}</h3>
                <p className={styles.notificationDescription}>{description}</p>
            </div>
            <div className={styles.toggleContainer}>
                <button className={styles.toggleButton}>On</button>
                <button className={styles.toggleButton}>Off</button>
            </div>
        </article>
    );
}

export default NotificationInSettings;