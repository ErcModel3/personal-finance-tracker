import React from "react";
import styles from "./ExpenseForm.module.css";

export function ExpenseForm() {
    return (
        <form className={styles.form}>
            <div className={styles.formField}>
                <label htmlFor="expenseName" className={styles.label}>
                    Expense Name
                </label>
                <input
                    type="text"
                    id="expenseName"
                    placeholder="Enter name"
                    className={styles.input}
                />
            </div>

            <div className={styles.formField}>
                <label htmlFor="amount" className={styles.label}>
                    Amount
                </label>
                <input
                    type="text"
                    id="amount"
                    placeholder="Enter amount"
                    className={styles.input}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.label}>Category</label>
                <div className={styles.categoryButtons}>
                    <button type="button" className={styles.categoryButton}>
                        Food
                    </button>
                    <button type="button" className={styles.categoryButton}>
                        Transport
                    </button>
                    <button type="button" className={styles.categoryButton}>
                        Utilities
                    </button>
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.cancelButton}>
                    Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                    Save Expense
                </button>
            </div>
        </form>
);
}
