'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Department } from './AuthContext';

export type WorkflowStatus = 'Draft' | 'PO_Review' | 'Purchasing_Action' | 'Sales_Analysis' | 'Finalized';

export interface Scenario {
    id: string;
    productId: string; // "Material Data"
    description: string;
    scenarioName: string;
    targetSellingPrice: string;
    status: WorkflowStatus;

    // COGS Flags (PO Step)
    cogsConfirmed?: boolean;

    // Purchasing Data
    purchasingPrice?: string;

    createdAt: Date;
}

interface DataContextType {
    scenarios: Scenario[];
    getScenario: (id: string) => Scenario | undefined;
    createScenario: (data: Partial<Scenario>) => string; // Returns ID
    updateScenario: (id: string, data: Partial<Scenario>) => void;
    deleteScenario: (id: string) => void;
    cloneScenario: (id: string, newName: string) => string; // Returns new ID

    // Workflow Actions
    submitToPO: (id: string) => void;
    confirmCOGS: (id: string) => void;
    submitPurchasing: (id: string, price: string) => void;
    finalizeSales: (id: string, finalPrice: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// SENDER_EMAIL from env (simulated)
const SENDER_EMAIL = process.env.NEXT_PUBLIC_SENDER_EMAIL || 'notifications@marginplus.com';

export function DataProvider({ children }: { children: ReactNode }) {
    const [scenarios, setScenarios] = useState<Scenario[]>([
        {
            id: '1',
            productId: 'MAT-100234',
            description: 'Industrial Pump V3',
            scenarioName: 'FY2026 Q1 Plan',
            targetSellingPrice: '1500.00',
            status: 'Draft',
            createdAt: new Date(),
        }
    ]);

    const sendEmail = (to: Department, subject: string, body: string, linkParams: { id: string, productId: string }) => {
        const link = `http://localhost:3000/zpl02?id=${linkParams.id}&productId=${linkParams.productId}`;
        console.log(`
      ---------------------------------------------------
      [EMAIL SENT]
      FROM: ${SENDER_EMAIL}
      TO: ${to} Team
      SUBJECT: ${subject}
      BODY: ${body}
      DEEP LINK: ${link}
      ---------------------------------------------------
    `);
        // In a real app, this would be an API call
        alert(`Email sent to ${to}: ${subject}`);
    };

    const getScenario = (id: string) => scenarios.find(s => s.id === id);

    const createScenario = (data: Partial<Scenario>) => {
        const newId = Math.random().toString(36).substr(2, 9);
        const newScenario: Scenario = {
            id: newId,
            productId: data.productId || '',
            description: data.description || '',
            scenarioName: data.scenarioName || '',
            targetSellingPrice: data.targetSellingPrice || '',
            status: 'Draft',
            createdAt: new Date(),
        };
        setScenarios(prev => [...prev, newScenario]);
        return newId;
    };

    const updateScenario = (id: string, data: Partial<Scenario>) => {
        setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const deleteScenario = (id: string) => {
        setScenarios(prev => prev.filter(s => s.id !== id));
    };

    const cloneScenario = (id: string, newName: string) => {
        const original = getScenario(id);
        if (!original) throw new Error('Scenario not found');

        const newId = createScenario({
            ...original,
            scenarioName: newName,
            status: 'Draft', // Reset status
        });
        return newId;
    };

    // Workflow Transitions

    const submitToPO = (id: string) => {
        const s = getScenario(id);
        if (!s) return;

        updateScenario(id, { status: 'PO_Review' });
        sendEmail(
            'Product Owner', // Recipient Lookup Mock
            `Action Required: Review ${s.productId}`,
            `Finance has initiated a new plan for ${s.scenarioName}. Please review COGS.`,
            { id: s.id, productId: s.productId }
        );
    };

    const confirmCOGS = (id: string) => {
        const s = getScenario(id);
        if (!s) return;

        updateScenario(id, { status: 'Purchasing_Action', cogsConfirmed: true });
        sendEmail(
            'Procurement',
            `Action Required: Costing for ${s.productId}`,
            `Product Owner confirmed components for ${s.scenarioName}. Please provide purchasing data.`,
            { id: s.id, productId: s.productId }
        );
    };

    const submitPurchasing = (id: string, price: string) => {
        const s = getScenario(id);
        if (!s) return;

        updateScenario(id, { status: 'Sales_Analysis', purchasingPrice: price });
        sendEmail(
            'Finance',
            `Costing Complete: ${s.productId}`,
            `Purchasing has updated costs for ${s.scenarioName}. Ready for Sales analysis.`,
            { id: s.id, productId: s.productId }
        );
        // Also notify Sales
        sendEmail(
            'Sales',
            `Ready for Analysis: ${s.productId}`,
            `Costs finalized for ${s.scenarioName}. Please review Target Selling Price.`,
            { id: s.id, productId: s.productId }
        );
    };

    const finalizeSales = (id: string, finalPrice: string) => {
        updateScenario(id, { status: 'Finalized', targetSellingPrice: finalPrice });
        // No email requested for this step, but good practice to finish.
    };

    return (
        <DataContext.Provider value={{
            scenarios,
            getScenario,
            createScenario,
            updateScenario,
            deleteScenario,
            cloneScenario,
            submitToPO,
            confirmCOGS,
            submitPurchasing,
            finalizeSales
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
