'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If no user is logged in, redirect to login page immediately
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // Prevent flashing the dashboard while checking
    if (!isAuthenticated) {
        return null;
    }

    // If logged in, show the Dashboard
    return (
        <div className="p-8 animate-fade-in">
            <div className="fiori-card max-w-4xl mx-auto">
                <h1 className="text-2xl mb-2 text-[#32363A]">MarginPlus Dashboard</h1>
                <p className="text-gray-600 mb-8">Welcome back, <strong>{user?.name}</strong> ({user?.department})</p>

                <div className="bg-blue-50 border-l-4 border-[#0854A0] p-4 rounded">
                    <h2 className="font-bold text-[#354A5F] mb-2">Quick Actions</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        <li>Type <strong>{user?.department === 'Finance' ? 'ZFI01' : 'ZPL01'}</strong> to Create a New Plan</li>
                        <li>Type <strong>ZPL02</strong> to Change an Existing Plan</li>
                        <li>Type <strong>ZPL03</strong> to Display Analytics</li>
                        {user?.department === 'Admin' && <li>Type <strong>ZAD01</strong> for User Administration</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}
