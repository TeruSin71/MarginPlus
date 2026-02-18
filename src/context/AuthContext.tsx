'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- FIXED: Added 'Admin' to the allowed departments ---
export type Department = 'Finance' | 'Sales' | 'Procurement' | 'Product Owner' | 'Admin';

type User = {
    id: string;
    name: string;
    department: Department;
};

type AuthContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Restore session from localStorage on load
    useEffect(() => {
        const stored = localStorage.getItem('zpl_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem('zpl_user');
            }
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('zpl_user', JSON.stringify(userData));
        router.push('/'); // Redirect to Dashboard after login
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('zpl_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);