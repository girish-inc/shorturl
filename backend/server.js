import express from 'express';
import cors from 'cors';
import { PORT, FRONTEND_URL, NODE_ENV } from './config/env.js';
import { initDatabase } from './db/index.js';
import linkRoutes from './routes/linkRoutes.js';
import { handleRedirect } from './controllers/linkController.js';

const app = express();

// Configure CORS for production deployment
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/links', linkRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/:code', handleRedirect);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
