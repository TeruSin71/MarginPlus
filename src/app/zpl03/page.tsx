'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function DisplayPage() {
    const { getScenario } = useData();
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const scenario = getScenario(id);
            if (scenario) setFormData(scenario);
        }
    }, [id, getScenario]);

    const isSales = user?.department === 'Sales';

    if (!formData) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <p>Please select a scenario to display (e.g., from a list or deep link).</p>
                <Button variant="ghost" onClick={() => window.history.back()}>Back</Button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h2>Display Profitability Plan (ZPL03)</h2>
            </div>

            <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                        name="materialData"
                        label="Material Data"
                        value={formData.materialData}
                        readOnly
                        disabled
                    />
                    <Input
                        name="description"
                        label="Description"
                        value={formData.description}
                        readOnly
                        disabled
                    />
                    <Input
                        name="scenarioName"
                        label="Scenario Name"
                        value={formData.scenarioName}
                        readOnly
                        disabled
                    />
                    <Input
                        name="targetSellingPrice"
                        label="Target Selling Price"
                        value={formData.targetSellingPrice}
                        readOnly
                        disabled
                    />

                    {/* Security Guardrail: COGS Hidden for Sales */}
                    {!isSales && (
                        <Input
                            name="purchasingPrice"
                            label="Component Cost (COGS)"
                            value={formData.purchasingPrice || '0.00'}
                            readOnly
                            disabled
                        />
                    )}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="ghost" onClick={() => window.history.back()}>Back</Button>
                </div>
            </Card>
        </div>
    );
}
