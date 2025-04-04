import React from "react";
import styles from "./Settings.module.css";

function AccountDetail({ icon, title, value, isSubdued = false }) {
    return (
        <article className={styles.card}>
            <div className={styles.iconContainer}>{icon}</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={`${styles.value} ${isSubdued ? styles.subdued : ""}`}>
                {value}
            </p>
        </article>
    );
}

export default AccountDetail;