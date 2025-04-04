import React from "react";
import styles from "./Settings.module.css";

function AccountDetail({ title, value, isSubdued = false }) {
    return (
        <article className={styles.compactCard}>
            <div className={styles.detailContent}>
                <h3 className={styles.detailTitle}>{title}</h3>
                <p className={`${styles.detailValue} ${isSubdued ? styles.subdued : ""}`}>
                    {value}
                </p>
            </div>
        </article>
    );
}

export default AccountDetail;