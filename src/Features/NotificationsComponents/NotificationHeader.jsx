import * as React from "react";
import styles from "./Notifications.module.css";
import NotificationInfo from "./NotificationInfo.jsx";
import ClearButton from "./ClearButton.jsx";

function NotificationHeader() {
    return (
        <section className={styles.section}>
            <NotificationInfo />
            <ClearButton />
        </section>
    );
}

export default NotificationHeader;
