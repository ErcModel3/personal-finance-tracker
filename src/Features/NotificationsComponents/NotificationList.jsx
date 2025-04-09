import * as React from "react";
import styles from "./Notifications.module.css";
import NotificationItem from "./NotificationItem.jsx";
import userID from "../../auth/SessionData.js";
import supabaseClient from "../../auth/Client.js";



// notifications will notify the user when there is an upcoming subscription or an ending Target.

//select all targets where target end date is < 5 days from now.
//Title : Target Name
//£X outstandning, N Days remaining!
const today = new Date();
const fivedaysfromtoday = today.setDate(today.getDate() + 5);

const getTargets = async () => {
    const {data, error} = await supabaseClient
        .from('Targets')
        .select('*')
        .eq('User_id', userID)
        .gte('Target_date', today)
        .lte('Target_date', fivedaysfromtoday);
    if (error) console.log(error);
    if (data){
        for (let item of data){
            notifications.push({
                title: item.Name,
                subtitle: `£${item.Goal - item.Current_completion} outstanding, N days Remaining!`,
            });
        }
    }
}

const notifications = [];

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
