import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = await pool.connect();

  try {
    // 1. Create Table if missing
    await client.query(`
      CREATE TABLE IF NOT EXISTS zpl_users (
        user_id TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        department TEXT NOT NULL,
        name TEXT
      );
    `);

    // 2. Clear existing users to avoid duplicates
    await client.query('DELETE FROM zpl_users');

    // 3. Insert Users (Including ADM01 with 'Admin' role)
    // Note: The previous script had 'Admin' as the department for ADM01.
    await client.query(`
      INSERT INTO zpl_users (user_id, password, department, name) VALUES
      ('ADM01', 'password123', 'Admin', 'System Admin (SAP_ALL)'),
      ('FIN01', 'password123', 'Finance', 'Alice Finance'),
      ('SAL01', 'password123', 'Sales', 'Bob Sales'),
      ('PRO01', 'password123', 'Procurement', 'Charlie Purchasing'),
      ('OWN01', 'password123', 'Product Owner', 'Diana Owner');
    `);

    return NextResponse.json({ message: '✅ Database setup complete. ADM01 created.' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}
