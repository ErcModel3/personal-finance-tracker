import * as React from "react";
import styles from "./Notifications.module.css";
import NotificationItem from "./NotificationItem.jsx";

const notifications = [
    {
        title: "Notification 1",
        subtitle: "You spent £100 on Wingstop, how greedy",
    },
    {
        title: "Notification 2",
        subtitle: "Your subscription to Netflix renewed",
    },
    {
        title: "Notification 3",
        subtitle: "Reminder: Your rent is due in 5 days",
    },
    {
        title: "Notification 4",
        subtitle: "Your subscription to Amazon Prime will renew in 5 days",
    },
    {
        title: "Notification 5",
        subtitle: "You spent £356 on Waitrose",
    },
    {
        title: "Notification 6",
        subtitle: "You spent £179 on Elden Ring Night Reign, great choice!",
    },
];

function NotificationList() {
    return (
        <section className={styles.list}>
            <h2 className={styles.heading}>New Notifications</h2>
            <div className={styles.notificationContainer}>
                {notifications.map((notification, index) => (
                    <NotificationItem
                        key={index}
                        title={notification.title}
                        subtitle={notification.subtitle}
                    />
                ))}
            </div>
        </section>
    );
}

export default NotificationList;
