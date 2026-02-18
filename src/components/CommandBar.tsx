'use client';

import React, { useState } from 'react';
import { useTCode } from '../hooks/useTCode';
import { useAuth, Department } from '../context/AuthContext';
import styles from './CommandBar.module.css';
import Link from 'next/link';

export function CommandBar() {
    const [code, setCode] = useState('');
    const { navigate } = useTCode();
    const { user, login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            navigate(code);
            setCode('');
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        login(e.target.value as Department);
    };

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                MarginPlus
            </Link>

            <form onSubmit={handleSubmit} className={styles.commandField}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter T-Code (e.g., ZPL01)"
                    className={styles.input}
                    aria-label="Command Field"
                />
            </form>

            <div className={styles.userInfo}>
                <span>{user?.name}</span>
                <select
                    className={styles.roleSwitcher}
                    value={user?.department}
                    onChange={handleRoleChange}
                    aria-label="Switch Role"
                >
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Product Owner">Product Owner</option>
                    <option value="Purchasing">Purchasing</option>
                </select>
            </div>
        </header>
    );
}
