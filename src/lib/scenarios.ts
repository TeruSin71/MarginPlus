import pool from '@/lib/db';

export async function getScenarios(): Promise<any[]> {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM scenarios');
    return rows;
  } finally {
    client.release();
  }
}
