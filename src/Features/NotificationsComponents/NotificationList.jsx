import * as React from "react";
import { useState, useEffect } from "react"; // Import these hooks
import styles from "./Notifications.module.css";
import NotificationItem from "./NotificationItem.jsx";
import userID from "../../auth/SessionData.js";
import supabaseClient from "../../auth/Client.js";

function NotificationList() {
    // Create state to store notifications
    const [notifications, setNotifications] = useState([]);

    // Function to get targets and update notifications
    const getTargets = async () => {
        const today = new Date();
        const fivedaysfromtoday = new Date();
        fivedaysfromtoday.setDate(today.getDate() + 5);

        const sessionID = await userID;

        const {data, error} = await supabaseClient
            .from('Targets')
            .select('*')
            .eq('User_id', sessionID)
            .gte('Target_date', today.toISOString())
            .lte('Target_date', fivedaysfromtoday.toISOString());

        if (error) console.log(error);

        if (data && data.length > 0) {
            const newNotifications = [...notifications];

            for (let item of data) {
                // Calculate days remaining
                const targetDate = new Date(item.Target_date);
                const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

                newNotifications.push({
                    title: item.Name,
                    subtitle: `£${item.Goal - item.Current_completion} outstanding, ${daysRemaining} days Remaining!`,
                });
            }

            // Update state with new notifications
            setNotifications(newNotifications);
        }
    };

    // Call getTargets when component mounts
    useEffect(() => {
        getTargets().then(() => null);
    }, []);

    return (
        <section className={styles.list}>
            <h2 className={styles.heading}>New Notifications</h2>
            <div className={styles.notificationContainer}>
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <NotificationItem
                            key={index}
                            title={notification.title}
                            subtitle={notification.subtitle}
                        />
                    ))
                ) : (
                    <p>No upcoming notifications</p>
                )}
            </div>
        </section>
    );
}

export default NotificationList;