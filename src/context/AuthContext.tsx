'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type Department = 'Finance' | 'Sales' | 'Procurement' | 'Product Owner' | 'Admin';

export type User = {
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

    // Optional: Restore session from localStorage on load
    useEffect(() => {
        const stored = localStorage.getItem('zpl_user');
        if (stored) setUser(JSON.parse(stored));
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
