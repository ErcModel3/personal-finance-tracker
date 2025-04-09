import * as React from "react";
import { useState, useEffect } from "react"; // Import these hooks
import styles from "./Notifications.module.css";
import NotificationItem from "./NotificationItem.jsx";
import userID from "../../auth/SessionData.js";
import supabaseClient from "../../auth/Client.js";

function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAllNotifications() {
            try {
                setIsLoading(true);

                // Create a single array to hold all notifications
                const allNotifications = [];

                // Fetch targets
                const today = new Date();
                const fivedaysfromtoday = new Date();
                fivedaysfromtoday.setDate(today.getDate() + 5);
                const sessionID = await userID;

                // Get targets
                const targetsResult = await supabaseClient
                    .from('Targets')
                    .select('*')
                    .eq('User_id', sessionID)
                    .gte('Target_date', today.toISOString().split('T')[0])
                    .lte('Target_date', fivedaysfromtoday.toISOString().split('T')[0]);

                if (targetsResult.error) console.log(targetsResult.error);

                if (targetsResult.data && targetsResult.data.length > 0) {
                    for (let item of targetsResult.data) {
                        const targetDate = new Date(item.Target_date);
                        const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

                        allNotifications.push({
                            title: item.Name,
                            subtitle: `£${item.Goal - item.Current_completion} outstanding, ${daysRemaining} days Remaining!`,
                        });
                    }
                }

                // Get bills
                const billsResult = await supabaseClient
                    .from('Direct_Debits')
                    .select('*')
                    .eq('Userid', sessionID);

                if (billsResult.error) {
                    console.log("Error fetching bills:", billsResult.error);
                } else if (billsResult.data && billsResult.data.length > 0) {
                    for (let item of billsResult.data) {
                        const startDate = new Date(item.Start_date);

                        // Handle recurring bills
                        let nextDueDate = new Date(startDate);
                        let daysRemaining = -1;

                        if (item.Recurrance === 'Weekly') {
                            while (nextDueDate <= today) {
                                nextDueDate.setDate(nextDueDate.getDate() + 7);
                            }
                            daysRemaining = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));
                        } else if (item.Recurrance === 'Monthly') {
                            while (nextDueDate <= today) {
                                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                            }
                            daysRemaining = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));
                        } else if (item.Recurrance === 'Yearly') {
                            while (nextDueDate <= today) {
                                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                            }
                            daysRemaining = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));
                        } else {
                            daysRemaining = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
                        }

                        if (daysRemaining <= 5) {
                            let daysMessage;
                            if (daysRemaining < 0) {
                                daysMessage = `${Math.abs(daysRemaining)} days ago`;
                            } else if (daysRemaining === 0) {
                                daysMessage = "today";
                            } else if (daysRemaining === 1) {
                                daysMessage = "tomorrow";
                            } else {
                                daysMessage = `in ${daysRemaining} days`;
                            }

                            allNotifications.push({
                                title: item.Name,
                                subtitle: `Bill payment: £${item.Amount} due ${daysMessage}.`,
                            });
                        }
                    }
                }

                // Update notifications with all items at once
                setNotifications(allNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllNotifications();
    }, []);

    return (
        <section className={styles.list}>
            <h2 className={styles.heading}>New Notifications</h2>
            <div className={styles.notificationContainer}>
                {isLoading ? (
                    <p>Loading notifications...</p>
                ) : notifications.length > 0 ? (
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