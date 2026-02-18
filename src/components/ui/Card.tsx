import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function Card({ title, action, children, className }: CardProps) {
    return (
        <div className={`${styles.card} ${className || ''}`}>
            {title && (
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}
