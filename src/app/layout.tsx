import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';
import { CommandBar } from '../components/CommandBar';
import { PasswordResetModal } from '../components/auth/PasswordResetModal';

export const metadata = {
    title: 'MarginPlus',
    description: 'Profitability Management',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <DataProvider>
                        <div className="app-shell">
                            <CommandBar />
                            <main className="main-content">
                                {children}
                            </main>
                            {/* Security Intercept */}
                            <PasswordResetModal />
                        </div>
                    </DataProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
