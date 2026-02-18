import React from 'react';

export default function Home() {
    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
            <h1>MarginPlus</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-md)' }}>
                Welcome to the MarginPlus Profitability Management System.
            </p>
            <div style={{
                marginTop: 'var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)'
            }}>
                <h2>Quick Start</h2>
                <p style={{ marginTop: 'var(--spacing-sm)' }}>
                    Use the Command Field (T-Code) to navigate.
                </p>
                <ul style={{ marginTop: 'var(--spacing-md)', paddingLeft: 'var(--spacing-lg)' }}>
                    <li><strong>ZPL01</strong> - Create New Plan</li>
                    <li><strong>ZPL02</strong> - Change Plan</li>
                    <li><strong>ZPL03</strong> - Display Plan</li>
                    <li><strong>ZPL04</strong> - Delete Plan</li>
                </ul>
            </div>
        </div>
    );
}
