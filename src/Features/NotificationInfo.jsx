import React from "react";
import styles from "./Notifications.module.css";

function NotificationInfo() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>John Doe</h2>
            <div className={styles.selection} />
            <p className={styles.description}>Welcome to your notifications</p>
        </div>
    );
}

export default NotificationInfo;
