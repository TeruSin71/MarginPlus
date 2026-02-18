'use client';

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth, User, Department } from '../context/AuthContext';

export default function AdminPage() {
    const { user, users, updateUser, generateTempPassword } = useAuth();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Authorization Check
    if (!user?.isAdmin) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <Card title="Authorization Error">
                    <p style={{ color: 'var(--status-error)' }}>
                        You are not authorized to access ZPL_ADMIN.
                        Role: {user?.department}
                    </p>
                </Card>
            </div>
        );
    }

    const handleEdit = (targetUser: User) => {
        setEditingUser({ ...targetUser }); // Clone for editing
    };

    const handleSave = () => {
        if (editingUser) {
            updateUser(editingUser.id, editingUser);
            setEditingUser(null);
            alert('User updated successfully.');
        }
    };

    const handleGeneratePassword = (id: string) => {
        const tempPass = generateTempPassword(id);
        alert(`Temporary Password Generated: ${tempPass}\n(In Prod: Sent via Email)`);
    };

    const toggleTCode = (code: string) => {
        if (!editingUser) return;
        const current = editingUser.allowedTCodes;
        const updated = current.includes(code)
            ? current.filter(c => c !== code)
            : [...current, code];
        setEditingUser({ ...editingUser, allowedTCodes: updated });
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h2>User Administration (ZPL_ADMIN)</h2>
            </div>

            <Card>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                            <th style={{ padding: '8px' }}>Name</th>
                            <th style={{ padding: '8px' }}>Department</th>
                            <th style={{ padding: '8px' }}>Location</th>
                            <th style={{ padding: '8px' }}>Allowed T-Codes</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '8px' }}>{u.firstName} {u.lastName}</td>
                                <td style={{ padding: '8px' }}>{u.department}</td>
                                <td style={{ padding: '8px' }}>{u.location}</td>
                                <td style={{ padding: '8px' }}>{u.allowedTCodes.join(', ')}</td>
                                <td style={{ padding: '8px' }}>
                                    <Button size="sm" variant="secondary" onClick={() => handleEdit(u)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Edit Modal / Form */}
            {editingUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>Edit User: {editingUser.email}</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="First Name"
                                    value={editingUser.firstName}
                                    onChange={e => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                />
                                <Input
                                    label="Last Name"
                                    value={editingUser.lastName}
                                    onChange={e => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                />
                            </div>
                            <Input
                                label="Location"
                                value={editingUser.location}
                                onChange={e => setEditingUser({ ...editingUser, location: e.target.value })}
                            />

                            <div>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Allowed T-Codes</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                    {['ZPL01', 'ZPL02', 'ZPL03', 'ZPL04', 'ZPL_ADMIN'].map(code => (
                                        <button
                                            key={code}
                                            type="button"
                                            onClick={() => toggleTCode(code)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-subtle)',
                                                backgroundColor: editingUser.allowedTCodes.includes(code) ? 'var(--accent-primary)' : 'transparent',
                                                color: editingUser.allowedTCodes.includes(code) ? 'white' : 'var(--text-secondary)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {code}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
                                <h4>Security</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <span>Reset Password</span>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleGeneratePassword(editingUser.id)}
                                    >
                                        Generate Temp Password
                                    </Button>
                                </div>
                                {editingUser.mustChangePassword && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--status-warning)', marginTop: '4px' }}>
                                        * User must change password on next login.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <Button variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
