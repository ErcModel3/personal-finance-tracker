import React from "react";
import styles from "./Notifications.module.css";

function NotificationInfo() {
    return (
        <div className={styles.centeredContainer}>
            <p className={styles.description}>Welcome to your notifications</p>
        </div>
    );
}

export default NotificationInfo;