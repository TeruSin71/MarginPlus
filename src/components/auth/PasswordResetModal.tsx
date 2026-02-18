'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function PasswordResetModal() {
    const { user, resetPassword } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    if (!user?.mustChangePassword) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        resetPassword(password);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999, // Max z-index
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{ width: '400px', maxWidth: '90%' }}>
                <Card title="Security Intercept: Password Reset Required">
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Your account is flagged for a mandatory password reset. You cannot proceed until this is completed.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <Input
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && <p style={{ color: 'var(--status-error)', fontSize: '0.9rem' }}>{error}</p>}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button type="submit" variant="primary">Set New Password</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
