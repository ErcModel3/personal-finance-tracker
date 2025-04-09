import React from 'react';
import styles from './InputField.module.css';

export const InputField = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    min,
    max,
    step,
    disabled = false
}) => {
    return (
        <div className={styles.inputGroup}>
            <label 
                htmlFor={name} 
                className={styles.inputLabel}
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.inputField}
                required={required}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
            />
        </div>
    );
};
export default InputField;
