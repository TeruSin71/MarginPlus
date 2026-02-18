import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    progress: number; // 0 to 100
    label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
    // Clamp between 0 and 100
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className={styles.container}>
            {label && (
                <div className={styles.header}>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.percentage}>{Math.round(clampedProgress)}%</span>
                </div>
            )}
            <div className={styles.track}>
                <div
                    className={styles.fill}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
}
