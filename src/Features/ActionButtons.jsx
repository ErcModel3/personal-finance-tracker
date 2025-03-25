import React from "react";
import styles from "./DirectDebitForm.module.css";

export function ActionButtons() {
  return (
    <div className={styles.buttonGroup}>
      <button type="button" className={styles.cancelButton}>
        Cancel
      </button>
      <button type="submit" className={styles.submitButton}>
        Add
      </button>
    </div>
  );
}
