'use client';

import React, { useState } from 'react';
import { useTCode } from '../hooks/useTCode';
import { useAuth, Department } from '../context/AuthContext';
import styles from './CommandBar.module.css';
import Link from 'next/link';

export default function CommandBar() {
  const [code, setCode] = useState('');
  const { navigate } = useTCode();
  const { user, logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(code);
      setCode('');
    }
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
          placeholder="Enter T-Code (e.g., ZFI01)"
          className={styles.input}
          aria-label="Command Field"
        />
      </form>

      <div className={styles.userInfo}>
        <span>{user ? user.name : 'Guest'}</span>
        {user ? (
          <button
            onClick={logout}
            className={styles.roleSwitcher}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          >
            Logout
          </button>
        ) : (
          <span style={{ marginLeft: '10px', fontSize: '0.8rem' }}>Not Logged In</span>
        )}
      </div>
    </header>
  );
}