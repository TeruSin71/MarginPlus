'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Department = 'Finance' | 'Sales' | 'Product Owner' | 'Purchasing' | 'Admin';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: Department;
    location: string;
    allowedTCodes: string[];
    mustChangePassword: boolean;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    users: User[]; // Simulate User Database
    login: (userId: string) => void; // Simplified Login by ID
    logout: () => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    resetPassword: (newPassword: string) => void;
    generateTempPassword: (id: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users Database
const INITIAL_USERS: User[] = [
    {
        id: 'user_finance',
        firstName: 'Alice',
        lastName: 'Finance',
        email: 'alice@marginplus.com',
        department: 'Finance',
        location: 'Hamilton, NZ',
        allowedTCodes: ['ZPL01', 'ZPL02', 'ZPL03', 'ZPL04'],
        mustChangePassword: false,
        isAdmin: false,
    },
    {
        id: 'user_sales',
        firstName: 'Bob',
        lastName: 'Sales',
        email: 'bob@marginplus.com',
        department: 'Sales',
        location: 'Auckland, NZ',
        allowedTCodes: ['ZPL02', 'ZPL03'],
        mustChangePassword: false, // Can be toggled by Admin
        isAdmin: false,
    },
    {
        id: 'user_po',
        firstName: 'Charlie',
        lastName: 'Owner',
        email: 'charlie@marginplus.com',
        department: 'Product Owner',
        location: 'Wellington, NZ',
        allowedTCodes: ['ZPL02', 'ZPL03'],
        mustChangePassword: false,
        isAdmin: false,
    },
    {
        id: 'user_purchasing',
        firstName: 'Dave',
        lastName: 'Buyer',
        email: 'dave@marginplus.com',
        department: 'Purchasing',
        location: 'Christchurch, NZ',
        allowedTCodes: ['ZPL02', 'ZPL03'],
        mustChangePassword: false,
        isAdmin: false,
    },
    {
        id: 'user_admin',
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@marginplus.com',
        department: 'Admin',
        location: 'Global',
        allowedTCodes: ['ZPL_ADMIN', 'ZPL03'],
        mustChangePassword: false,
        isAdmin: true,
    },
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [user, setUser] = useState<User | null>(INITIAL_USERS[0]); // Default to Finance

    const login = (userId: string) => {
        const foundUser = users.find(u => u.id === userId);
        if (foundUser) {
            setUser(foundUser);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (id: string, updates: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        // If updating current user, reflect immediately
        if (user?.id === id) {
            setUser(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const resetPassword = (newPassword: string) => {
        if (!user) return;
        console.log(`Password reset for ${user.email} to: ${newPassword}`);
        updateUser(user.id, { mustChangePassword: false });
    };

    const generateTempPassword = (id: string) => {
        const tempPass = Math.random().toString(36).slice(-8);
        updateUser(id, { mustChangePassword: true });

        // Mock Email
        const targetUser = users.find(u => u.id === id);
        const sender = process.env.NEXT_PUBLIC_SENDER_EMAIL || 'admin@marginplus.com';

        if (targetUser) {
            console.log(`
        ---------------------------------------------------
        [EMAIL SENT]
        FROM: ${sender}
        TO: ${targetUser.email}
        SUBJECT: Action Required: Temporary Password
        BODY: Your temporary password is: ${tempPass}
        ACTION: Please login and reset your password immediately.
        ---------------------------------------------------
        `);
        }
        return tempPass;
    };

    return (
        <AuthContext.Provider value={{
            user,
            users,
            login, // Expose for Role Switcher
            logout,
            updateUser,
            resetPassword,
            generateTempPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
