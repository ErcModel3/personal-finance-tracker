import React from "react";
import styles from "./Notifications.module.css";

function NotificationInfo() {
    return (
        <div className={styles.centeredContainer}>
            <h2 className={styles.title}>John Doe</h2>
            <p className={styles.description}>Welcome to your notifications</p>
        </div>
    );
}

export default NotificationInfo;