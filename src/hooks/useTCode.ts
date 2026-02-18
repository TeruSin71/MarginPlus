import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export function useTCode() {
    const router = useRouter();
    const { user } = useAuth();

    const navigate = (tcode: string) => {
        const code = tcode.toUpperCase().trim();

        if (!user) {
            alert("Please log in first.");
            router.push('/login');
            return;
        }

        // --- SAP_ALL CHECK ---
        // If user is Admin, they bypass the department restrictions completely.
        if (user.department !== 'Admin') {

            // Standard Logic for Normal Users
            const allowedPrefixes: Record<string, string> = {
                'Finance': 'ZFI',
                'Sales': 'ZSL',
                'Procurement': 'ZPR',
                'Product Owner': 'ZOW'
            };

            const requiredPrefix = allowedPrefixes[user.department];

            // If the department doesn't match the code prefix, Block Access.
            if (!requiredPrefix || !code.startsWith(requiredPrefix)) {
                alert(`⛔ Authorization Failed: You are not authorized to use transaction ${code}.`);
                return;
            }
        }

        // --- Route Mapping ---
        // Since Admin (SAP_ALL) passed the check above, they just need the route logic.
        let targetRoute = '';

        if (code.endsWith('01')) {
            targetRoute = '/zpl01'; // Create
        } else if (code.endsWith('02')) {
            targetRoute = '/zpl02'; // Change
        } else if (code.endsWith('03')) {
            targetRoute = '/zpl03'; // Display
        } else if (code.endsWith('04')) {
            targetRoute = '/zpl04'; // Admin/Delete
        } else {
            alert("❌ T-Code not found.");
            return;
        }

        router.push(targetRoute);
    };

    return { navigate };
}
