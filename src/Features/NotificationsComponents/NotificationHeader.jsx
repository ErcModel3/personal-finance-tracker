import * as React from "react";
import styles from "./Notifications.module.css";
import NotificationInfo from "./NotificationInfo.jsx";
import ClearButton from "./ClearButton.jsx";

function NotificationHeader() {
    return (
        <div className={styles.headerWrapper}>
            <section className={styles.section}>
                <NotificationInfo />
            </section>
            <ClearButton />
        </div>
    );
}

export default NotificationHeader;