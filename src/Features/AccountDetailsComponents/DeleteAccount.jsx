import React from "react";
import styles from "./Settings.module.css";

function DeleteAccount() {
    return (
        <section className={styles.section}>
            <button className={styles.deleteButton}>Delete Account</button>
        </section>
    );
}

export default DeleteAccount;
