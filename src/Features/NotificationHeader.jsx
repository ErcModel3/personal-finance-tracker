import * as React from "react";
import styles from "./Notifications.module.css";
import Avatar from "./Avatar";
import NotificationInfo from "./NotificationInfo";
import ClearButton from "./ClearButton";

function NotificationHeader() {
    return (
        <section className={styles.section}>
            <Avatar />
            <NotificationInfo />
            <ClearButton />
        </section>
    );
}

export default NotificationHeader;
