

import { Pool } from 'pg';
import { attachDatabasePool } from "@vercel/functions"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

attachDatabasePool(pool);

export default async function handler(req, res){
    const client = await pool.connect();
  
  try {
    const { rows } = await client.query('SELECT * FROM people');
    res.status(200).json(rows);
  } finally {
    client.release();
  }
}