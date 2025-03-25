import React from "react";
import styles from "./DirectDebitForm.module.css";

export function InputField({ label, placeholder, type }) {
    return (
        <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className={styles.inputField}
            />
        </div>
    );
}
