import React from "react";
import styles from "./Notifications.module.css";

function ClearButton() {
    return (
        <div className={styles.button}>
            <button className={styles.seconday}>Clear All</button>
        </div>
    );
}

export default ClearButton;
