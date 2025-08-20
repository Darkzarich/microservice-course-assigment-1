import { Pool } from 'pg';

async function initDb() {
  await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    first_name VARCHAR(255), 
    second_name VARCHAR(255), 
    birthdate DATE, biography TEXT, 
    city VARCHAR(255), 
    password VARCHAR(255) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS messages (
    "from" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "to" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT, 
    created_at TIMESTAMP DEFAULT NOW()
  );`
  );
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
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

await initDb().catch((err) => {
  console.error("Initialization failed:", err);
  process.exit(1);
});

export default pool;