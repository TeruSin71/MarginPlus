'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useTCode } from '@/hooks/useTCode';

function Zpl02Content() {
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
    if (isPO && formData.status === 'PD_Review') {
      confirmCOGS(id);
      alert('COGS confirmed. Notifying Purchasing.');
    } else if (isPurchasing && formData.status === 'Purchasing_Action') {
      submitPurchasing(id, '1200.00'); // Logic simplified for prototype
      alert('Purchasing complete. Notifying Sales & Finance.');
    } else if (isSales && formData.status === 'Sales_Analysis') {
      finalizeSales(id, formData.targetSellingPrice);
      alert('Sales Analysis Complete. Scenario Finalized.');
    } else {
      alert('Changes saved.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!formData) return <div>Scenario not found.</div>;

  return (
    <div className="p-8">
      <Card className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Change Scenario: {formData.name}</h1>
        <div className="space-y-4">
          <Input 
            label="Scenario Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            disabled={!canEditBase}
          />
          <Input 
            label="Description" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={!canEditBase}
          />
           <div className="flex gap-4 mt-6">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="secondary" onClick={() => setShowCloneModal(true)}>Clone Scenario</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <Zpl02Content />
    </Suspense>
  );
}