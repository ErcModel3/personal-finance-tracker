import React from "react";
import styles from "./Settings.module.css";

function NotificationInSettings({ title, description }) {
    return (
        <article className={styles.card}>
            <div className={styles.icon} />
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.toggleContainer}>
                    <button className={styles.toggleButton}>On</button>
                    <button className={styles.toggleButton}>Off</button>
                </div>
            </div>
        </article>
    );
}

export default NotificationInSettings;
