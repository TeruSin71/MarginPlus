'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
    const { user } = useAuth();

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h2>User Administration (ZPL_ADMIN)</h2>
            </div>

            <Card>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h3 style={{ color: 'var(--status-warning)' }}>Under Maintenance</h3>
                    <p style={{ marginTop: '1rem' }}>
                        The User Administration module is currently being updated to support the new Database Integration.
                    </p>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Current User: {user?.name} ({user?.department})
                    </p>
                </div>
            </Card>
        </div>
    );
}
