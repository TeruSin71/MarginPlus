import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, required, className, ...props }, ref) => {
        return (
            <div className={styles.inputWrapper}>
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
                <input
                    ref={ref}
                    className={`${styles.input} ${className || ''}`}
                    aria-invalid={!!error}
                    disabled={props.disabled}
                    {...props}
                />
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
