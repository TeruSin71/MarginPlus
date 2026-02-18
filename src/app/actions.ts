'use server';

import pool from '@/lib/db';

export async function authenticateUser(formData: FormData) {
    const userId = formData.get('userId') as string;
    const password = formData.get('password') as string;

    if (!userId || !password) {
        return { error: 'Please enter both User ID and Password' };
    }

    if (!process.env.DATABASE_URL) {
        return { error: 'Database configuration missing (DATABASE_URL)' };
    }

    // Connect specifically for this request
    const client = await pool.connect();

    try {
        // Check DB for user
        const { rows } = await client.query(
            'SELECT * FROM zpl_users WHERE user_id = $1 AND password = $2',
            [userId, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            // Return the user data to the client
            return {
                success: true,
                user: {
                    id: user.user_id,
                    name: user.name,
                    department: user.department
                }
            };
        } else {
            return { error: 'Invalid User ID or Password' };
        }
    } catch (error) {
        console.error('Login Error:', error);
        return { error: 'Database connection failed' };
    } finally {
        client.release();
    }
}
