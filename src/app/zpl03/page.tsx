'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

function Zpl03Content() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  return (
    <div className="p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">ZPL03 Processing</h1>
        <p>Processing ID: {id}</p>
        <div className="mt-4">
           {/* Add your specific ZPL03 form logic here */}
           <p className="text-gray-500">Form content loaded.</p>
        </div>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading ZPL03...</div>}>
      <Zpl03Content />
    </Suspense>
  );
}