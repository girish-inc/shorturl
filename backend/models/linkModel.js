import { pool } from '../db/index.js';

export async function createLinkRecord(code, url) {
  const result = await pool.query(
    'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *',
    [code, url]
  );
  return result.rows[0];
}

export async function getAllLinks() {
  const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
  return result.rows;
}

export async function findLinkByCode(code) {
  const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
  return result.rows[0] || null;
}

export async function codeExists(code) {
  const result = await pool.query('SELECT id FROM links WHERE code = $1', [code]);
  return result.rows.length > 0;
}

export async function incrementLinkClick(code) {
  await pool.query(
    'UPDATE links SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP WHERE code = $1',
    [code]
  );
}

export async function deleteLinkByCode(code) {
  const result = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);
  return result.rows[0] || null;
}

export async function getLinkStats(code) {
  const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
  return result.rows[0] || null;
}

