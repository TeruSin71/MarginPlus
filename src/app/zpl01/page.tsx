'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useTCode } from '@/hooks/useTCode';

export default function CreatePage() {
    const { user } = useAuth();
    const { createScenario, submitToPO } = useData();
    const { navigate } = useTCode();

    const [formData, setFormData] = useState({
        materialData: '',
        description: '',
        scenarioName: '',
    });

    const [progress, setProgress] = useState(0);
    const [createdId, setCreatedId] = useState<string | null>(null);

    // Field Ownership Logic
    const isFinance = user?.department === 'Finance';
    const canEditBase = isFinance;

    // Calculate Progress
    useEffect(() => {
        let completed = 0;
        if (formData.materialData) completed++;
        if (formData.description) completed++;
        if (formData.scenarioName) completed++;

        // 3 mandatory fields
        setProgress((completed / 3) * 100);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAndNotify = () => {
        if (progress < 100) return;

        // 1. Create Record
        const newId = createScenario({
            ...formData,
            targetSellingPrice: '0.00' // Init
        });
        setCreatedId(newId);

        // 2. Trigger Workflow
        submitToPO(newId);

        // 3. Redirect or Show Success
        alert(`Plan created (ID: ${newId}) and Product Owner notified.`);
        navigate('ZPL02', { id: newId });
    };

    if (!canEditBase) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <Card title="Authorization Error">
                    <p style={{ color: 'var(--status-error)' }}>
                        Only Finance department can create new plans (ZPL01).
                        Current Role: {user?.department}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h2>Create Profitability Plan (ZPL01)</h2>
                <ProgressBar progress={progress} label="Mandatory Fields Completion" />
            </div>

            <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                        name="materialData"
                        label="Material Data"
                        value={formData.materialData}
                        onChange={handleChange}
                        required
                        disabled={!canEditBase}
                    />
                    <Input
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        disabled={!canEditBase}
                    />
                    <Input
                        name="scenarioName"
                        label="Scenario Name"
                        value={formData.scenarioName}
                        onChange={handleChange}
                        required
                        disabled={!canEditBase}
                    />

                    <Input
                        name="targetSellingPrice"
                        label="Target Selling Price"
                        value=""
                        disabled={true}
                        placeholder="Set by Sales in ZPL02"
                    />
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button type="button" variant="ghost" onClick={() => navigate('ZPL03')}>Cancel</Button>
                    <Button
                        onClick={handleSaveAndNotify}
                        disabled={progress < 100}
                        title={progress < 100 ? "Complete all mandatory fields" : "Save and Notify PO"}
                    >
                        Save & Notify PO
                    </Button>
                </div>
            </Card>
        </div>
    );
}
