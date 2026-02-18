'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const T_CODES = {
    CREATE: 'ZPL01',
    CHANGE: 'ZPL02',
    DISPLAY: 'ZPL03',
    DELETE: 'ZPL04',
} as const;

export type TCode = typeof T_CODES[keyof typeof T_CODES];

export function useTCode() {
    const router = useRouter();

    const navigate = useCallback((code: string, params?: Record<string, string>) => {
        const normalizedCode = code.toUpperCase().trim();

        let path = '';
        switch (normalizedCode) {
            case T_CODES.CREATE:
                path = '/zpl01';
                break;
            case T_CODES.CHANGE:
                path = '/zpl02';
                break;
            case T_CODES.DISPLAY:
                path = '/zpl03';
                break;
            case T_CODES.DELETE:
                path = '/zpl04';
                break;
            default:
                console.warn(`Unknown T-Code: ${code}`);
                return;
        }

        if (params) {
            const query = new URLSearchParams(params).toString();
            path += `?${query}`;
        }

        router.push(path);
    }, [router]);

    return { navigate };
}
