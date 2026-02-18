'use client';

import { useState } from 'react';
import { authenticateUser } from '../actions';
import { useAuth, Department } from '../../context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        const result = await authenticateUser(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else if (result.success && result.user) {
            login({
                ...result.user,
                department: result.user.department as Department
            });
            // The login function in AuthContext redirects to '/' automatically
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>MarginPlus</h1>
                <p className={styles.subtitle}>Sign in to continue</p>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form action={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>User ID</label>
                        <input
                            name="userId"
                            placeholder="User ID (e.g. FIN01)"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Signing in...' : 'Log On'}
                    </button>
                </form>

                <div className={styles.footer}>
                    © 2026 MarginPlus Corp
                </div>
            </div>
        </div>
    );
}
