import { Pool } from 'pg';

const pool = new Pool({
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.PGPORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

console.debug('Connecting to database...');

export const connection = await pool.connect();

connection.on('connect', () => {
  console.log('Connected to database');
});

connection.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

connection.on('notification', (message) => {
  console.log('Notification:', message);
});

connection.on('end', () => {
  console.log('Connection ended');
});

export default pool;