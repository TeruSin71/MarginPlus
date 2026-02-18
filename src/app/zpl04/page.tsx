'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

// Mock Data
const MOCK_DATA = {
    materialData: 'MAT-100234',
    description: 'Industrial Pump V3',
    scenarioName: 'FY2026 Q1 Plan',
    targetSellingPrice: '1500.00',
};

export default function DeletePage() {
    const { user } = useAuth();
    const [success, setSuccess] = useState(false);

    // Only Finance can delete
    const canDelete = user?.department === 'Finance';

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
            console.log('Deleting plan...');
            setSuccess(true);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h2>Delete Profitability Plan (ZPL04)</h2>
                <p style={{ color: 'var(--status-error)' }}>
                    Review the plan details before deletion.
                </p>
            </div>

            <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                        name="materialData"
                        label="Material Data"
                        value={MOCK_DATA.materialData}
                        readOnly
                        disabled
                    />
                    <Input
                        name="description"
                        label="Description"
                        value={MOCK_DATA.description}
                        readOnly
                        disabled
                    />
                    <Input
                        name="scenarioName"
                        label="Scenario Name"
                        value={MOCK_DATA.scenarioName}
                        readOnly
                        disabled
                    />
                    <Input
                        name="targetSellingPrice"
                        label="Target Selling Price"
                        value={MOCK_DATA.targetSellingPrice}
                        readOnly
                        disabled
                    />
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button variant="ghost">Cancel</Button>
                    {canDelete && !success && (
                        <Button variant="danger" onClick={handleDelete}>Delete Plan</Button>
                    )}
                </div>

                {success && (
                    <div style={{ marginTop: '1rem', color: 'var(--status-success)' }}>
                        Plan deleted successfully.
                    </div>
                )}

                {!canDelete && (
                    <div style={{ marginTop: '1rem', color: 'var(--status-error)' }}>
                        You do not have permission to delete plans.
                    </div>
                )}
            </Card>
        </div>
    );
}
