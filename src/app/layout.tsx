'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';
import CommandBar from '../components/CommandBar';
import { PasswordResetModal } from '../components/auth/PasswordResetModal';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show Command Bar on the login page
    const showCommandBar = pathname !== '/login';

    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <DataProvider>
                        {showCommandBar && <CommandBar />}
                        <main>
                            {children}
                        </main>
                        {/* Security Intercept */}
                        <PasswordResetModal />
                    </DataProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
