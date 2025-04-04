import * as React from "react";
import styles from "./Notifications.module.css";

const NotificationItem = ({ title, subtitle }) => {
    return (
        <article className={styles.row}>
            <div className={styles.item}>
                <div className={styles.frame}>🔔</div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
            </div>
        </article>
    );
};

export default NotificationItem;