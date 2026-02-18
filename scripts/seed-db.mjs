
import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Read .env.local manually since we don't have dotenv
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);

if (!dbUrlMatch) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
}

const connectionString = dbUrlMatch[1].trim();

const pool = new Pool({ connectionString });

const sql = `
-- 1. Create the Users Table
CREATE TABLE IF NOT EXISTS zpl_users (
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    department TEXT NOT NULL,
    name TEXT
);

-- 2. Insert Test Users
INSERT INTO zpl_users (user_id, password, department, name) VALUES
('FIN01', 'password123', 'Finance', 'Alice Finance'),
('SAL01', 'password123', 'Sales', 'Bob Sales'),
('PRO01', 'password123', 'Procurement', 'Charlie Purchasing'),
('OWN01', 'password123', 'Product Owner', 'Diana Owner')
ON CONFLICT (user_id) DO NOTHING;
`;

async function main() {
    const client = await pool.connect();
    try {
        console.log('Running SQL...');
        await client.query(sql);
        console.log('Successfully created table and seeded users.');

        // Verification query
        const res = await client.query('SELECT * FROM zpl_users');
        console.log('Current Users:', res.rows);
    } catch (err) {
        console.error('Error running SQL:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
