'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './zpl02.module.css';

// --- Types ---
type Scenario = {
    id: string;
    name: string;
    description: string;
    cogs: {
        material: number;
        labor: number;
        overhead: number;
    };
};

export default function ScenarioManager() {
    const { user } = useAuth();

    // --- State ---
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // Dummy Initial Data (Replace with DB fetch later)
    const [scenarios, setScenarios] = useState<Scenario[]>([
        {
            id: '1',
            name: 'Base Case 2026',
            description: 'Standard operating costs',
            cogs: { material: 450, labor: 120, overhead: 80 }
        },
        {
            id: '2',
            name: 'Optimistic Q3',
            description: 'Reduced material costs by 10%',
            cogs: { material: 405, labor: 120, overhead: 80 }
        }
    ]);

    // Set default scenario on load
    useEffect(() => {
        if (scenarios.length > 0 && !selectedScenario) {
            setSelectedScenario(scenarios[0]);
        }
    }, [scenarios, selectedScenario]);

    // --- Handlers ---
    const handleSave = () => {
        alert(`Saved changes to ${selectedScenario?.name}`);
    };

    const handleClone = () => {
        if (!selectedScenario) return;
        const newScenario = {
            ...selectedScenario,
            id: Math.random().toString(),
            name: `${selectedScenario.name} (Copy)`,
        };
        setScenarios([...scenarios, newScenario]);
        setSelectedScenario(newScenario);
    };

    const updateCogs = (field: keyof Scenario['cogs'], value: string) => {
        if (!selectedScenario) return;
        const numValue = parseFloat(value) || 0;
        setSelectedScenario({
            ...selectedScenario,
            cogs: { ...selectedScenario.cogs, [field]: numValue }
        });
    };

    // --- Permission Check ---
    const hasEditAccess = ['Finance', 'Product Owner'].includes(user?.department || '');

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>Change Scenario: {selectedScenario?.name}</h1>
                <div className="flex gap-2">
                    <button onClick={handleSave} disabled={!hasEditAccess} className="primary px-4 py-2">Save</button>
                    <button onClick={handleClone} className="secondary px-4 py-2">Clone</button>
                </div>
            </header>

            {/* Object Header / Filter Bar */}
            <div className="fiori-card mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Scenario ID</label>
                        <select
                            className="w-full"
                            value={selectedScenario?.id || ''}
                            onChange={(e) => {
                                const scen = scenarios.find(s => s.id === e.target.value);
                                setSelectedScenario(scen || null);
                            }}
                        >
                            {scenarios.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Description</label>
                        <input
                            className="w-full"
                            value={selectedScenario?.description || ''}
                            onChange={(e) => selectedScenario && setSelectedScenario({ ...selectedScenario, description: e.target.value })}
                            disabled={!hasEditAccess}
                        />
                    </div>
                </div>
            </div>

            {/* COGS Table Section */}
            {hasEditAccess ? (
                <div className="fiori-card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={styles.sectionTitle}>COGS Breakdown</h3>

                        {/* Simulation Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsSimulating(!isSimulating)}
                                className={`px-4 py-2 text-sm rounded ${isSimulating ? 'primary' : 'secondary'}`}
                            >
                                {isSimulating ? 'Stop Simulation' : 'Simulate'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Material Cost */}
                        <div className={styles.kpiCard}>
                            <div className={styles.kpiLabel}>Material Cost</div>
                            <input
                                type="number"
                                className="w-full"
                                value={selectedScenario?.cogs.material || 0}
                                onChange={(e) => updateCogs('material', e.target.value)}
                                disabled={isSimulating}
                            />
                        </div>

                        {/* Labor Cost */}
                        <div className={styles.kpiCard}>
                            <div className={styles.kpiLabel}>Labor Cost</div>
                            <input
                                type="number"
                                className="w-full"
                                value={selectedScenario?.cogs.labor || 0}
                                onChange={(e) => updateCogs('labor', e.target.value)}
                                disabled={isSimulating}
                            />
                        </div>

                        {/* Overhead Cost */}
                        <div className={styles.kpiCard}>
                            <div className={styles.kpiLabel}>Overhead</div>
                            <input
                                type="number"
                                className="w-full"
                                value={selectedScenario?.cogs.overhead || 0}
                                onChange={(e) => updateCogs('overhead', e.target.value)}
                                disabled={isSimulating}
                            />
                        </div>
                    </div>

                    {/* Total Calculation Display */}
                    <div className="mt-6 p-4 bg-gray-100 rounded flex justify-between items-center">
                        <span className="font-bold text-lg">Total COGS:</span>
                        <span className="font-mono text-xl text-green-600">
                            $
                            {((selectedScenario?.cogs.material || 0) +
                                (selectedScenario?.cogs.labor || 0) +
                                (selectedScenario?.cogs.overhead || 0)).toFixed(2)}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="fiori-card p-6 text-center text-gray-500">
                    <h2 className="text-xl font-bold mb-2">View Only Access</h2>
                    <p>Your department ({user?.department}) does not have permission to edit COGS details.</p>
                </div>
            )}
        </div>
    );
}