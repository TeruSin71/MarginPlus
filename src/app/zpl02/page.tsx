'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTCode } from '../../hooks/useTCode';

export default function ChangePage() {
    const { user } = useAuth();
    const { getScenario, updateScenario, cloneScenario, submitPurchasing, confirmCOGS, finalizeSales } = useData();
    const searchParams = useSearchParams();
    const { navigate } = useTCode();

    const id = searchParams.get('id');
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Clone State
    const [showCloneModal, setShowCloneModal] = useState(false);
    const [cloneName, setCloneName] = useState('');

    // Load Data
    useEffect(() => {
        if (id) {
            const scenario = getScenario(id);
            if (scenario) {
                setFormData(scenario);
            } else {
                alert('Scenario not found');
            }
        }
        setLoading(false);
    }, [id, getScenario]);

    // RBAC Logic
    const isFinance = user?.department === 'Finance';
    const isSales = user?.department === 'Sales';
    const isPO = user?.department === 'Product Owner';
    const isPurchasing = user?.department === 'Purchasing';

    const canEditBase = isFinance && formData?.status === 'Draft';
    const canEditPrice = isSales && formData?.status === 'Sales_Analysis';

    // Workflow Actions
    const handleSave = () => {
        if (!id || !formData) return;
        updateScenario(id, formData);

        // Workflow Triggers
        if (isPO && formData.status === 'PO_Review') {
            confirmCOGS(id);
            alert('COGS confirmed. Notifying Purchasing.');
        } else if (isPurchasing && formData.status === 'Purchasing_Action') {
            // Mock Purchasing Logic
            submitPurchasing(id, '1200.00'); // Logic simplified for prototype
            alert('Purchasing complete. Notifying Sales & Finance.');
        } else if (isSales && formData.status === 'Sales_Analysis') {
            finalizeSales(id, formData.targetSellingPrice);
            alert('Sales Analysis Complete. Scenario Finalized.');
        } else {
            alert('Changes saved.');
        }
    };

    const handleClone = () => {
        if (!id || !cloneName) return;
        const newId = cloneScenario(id, cloneName);
        setShowCloneModal(false);
        navigate('ZPL02', { id: newId });
        alert(`Scenario cloned as ${cloneName}. Redirecting to new ID: ${newId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (!formData && !loading) return (
        <div className="container" style={{ padding: '2rem' }}>
            <p>No scenario ID provided. Use ZPL01 to create one or select from ZPL03.</p>
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Change Profitability Plan (ZPL02)</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Status: <strong>{formData.status}</strong> | Role: {user?.department}
                    </p>
                </div>
                <Button variant="secondary" onClick={() => setShowCloneModal(true)}>
                    Save As New Scenario
                </Button>
            </div>

            <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                        name="materialData"
                        label="Material Data"
                        value={formData.materialData}
                        onChange={(e) => setFormData({ ...formData, materialData: e.target.value })}
                        disabled={!canEditBase}
                    />
                    <Input
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={!canEditBase}
                    />
                    <Input
                        name="scenarioName"
                        label="Scenario Name"
                        value={formData.scenarioName}
                        onChange={(e) => setFormData({ ...formData, scenarioName: e.target.value })}
                        disabled={!canEditBase}
                    />

                    <Input
                        name="targetSellingPrice"
                        label="Target Selling Price"
                        value={formData.targetSellingPrice}
                        onChange={(e) => setFormData({ ...formData, targetSellingPrice: e.target.value })}
                        disabled={!canEditPrice}
                        style={!canEditPrice ? { cursor: 'not-allowed', color: 'var(--text-tertiary)' } : {}}
                    />

                    {/* Costing Data - HIDDEN for Sales */}
                    {!isSales && (
                        <Input
                            name="purchasingPrice"
                            label="Component Cost (COGS)"
                            value={formData.purchasingPrice || '0.00'}
                            disabled={true} // Read-only for everyone in this view, populated by Purchasing
                            style={{ color: 'var(--text-secondary)' }}
                        />
                    )}
                </div>

                {/* AI Analysis for Sales */}
                {isSales && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>AI Market Intelligence</h4>
                            <Button size="sm" variant="secondary" onClick={() => alert(`
                                🤖 Gemini Market Analysis
                                --------------------------------
                                Product: ${formData.materialData}
                                Competitor A: $1,450.00
                                Competitor B: $1,520.00
                                
                                Analysis: Your target price of $${formData.targetSellingPrice} is competitive. 
                                Recommendation: Maintain current pricing strategy.
                                
                                [CONFIDENTIAL: Internal Costs are NEVER displayed in this analysis]
                            `)}>
                                Run Analysis
                            </Button>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSave}>
                        {isPO && formData.status === 'PO_Review' ? 'Confirm COGS' :
                            isPurchasing && formData.status === 'Purchasing_Action' ? 'Finalize Costs' :
                                isSales && formData.status === 'Sales_Analysis' ? 'Finalize Price' : 'Save Changes'}
                    </Button>
                </div>
            </Card>

            {/* Clone Modal (Simple Inline Implementation for Prototype) */}
            {showCloneModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                        <h3>Save As New Scenario</h3>
                        <Input
                            label="New Scenario Name"
                            value={cloneName}
                            onChange={(e) => setCloneName(e.target.value)}
                            style={{ marginTop: '1rem' }}
                        />
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <Button variant="ghost" onClick={() => setShowCloneModal(false)}>Cancel</Button>
                            <Button onClick={handleClone}>Create Copy</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
