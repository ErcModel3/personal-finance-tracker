import React from "react";
import styles from "./ExpenseForm.module.css";

function ExpesnseFormHeader() {
    return (
        <header className={styles.headerContainer}>
            <h1 className={styles.title}>Add New Expense</h1>
            <p className={styles.description}>
                Enter the details of your new expense below.
            </p>
        </header>
    );
}

export default ExpesnseFormHeader;
