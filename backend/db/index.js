import pg from 'pg';
import { DATABASE_URL } from '../config/env.js';

const { Pool } = pg;

console.log('🔗 Connecting to database...');
console.log('Database host:', DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown');

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function initDatabase() {
  const query = `
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_clicked TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_code ON links(code);
  `;

  try {
    await pool.query(query);
    console.log('✓ Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  }
}

