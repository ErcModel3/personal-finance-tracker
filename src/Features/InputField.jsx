// Fixed InputField.jsx
import React from "react";
import styles from "./DirectDebitForm.module.css";

export function InputField({ label, placeholder, type, name, value, onChange, required }) {
  const handleChange = (e) => {
    // Log the change to verify it's working
    console.log(`InputField onChange: ${name} = ${e.target.value}`);
    
    // Pass the event to the parent's onChange handler
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}{required && '*'}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={styles.inputField}
        name={name}
        value={value || ''}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}