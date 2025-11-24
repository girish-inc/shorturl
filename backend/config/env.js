import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV || 'development';

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please provide a NeonDB connection string in the backend .env file.');
  process.exit(1);
}

