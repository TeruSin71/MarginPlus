
import { Pool } from '@neondatabase/serverless';

// Ensure we don't crash during build if DATABASE_URL is missing
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString || '', // Fallback to empty string to avoid constructor error
});

export default pool;
