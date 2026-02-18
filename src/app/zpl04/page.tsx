'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function Zpl04Content() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">ZPL04 Overview</h1>
        <p>Viewing details for ID: {id}</p>
        <div className="mt-4">
           {/* Add your specific ZPL04 logic here */}
           <Button onClick={() => alert('Action Triggered')}>Process Action</Button>
        </div>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading ZPL04...</div>}>
      <Zpl04Content />
    </Suspense>
  );
}