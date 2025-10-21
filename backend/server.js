import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config({ path: './backend/.env' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Simple MySQL pool using mysql2/promise
let pool;
async function initDb() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'midway_storage',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  return pool;
}

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Simple login endpoint (demo only)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  // Demo credentials: admin / admin123
  if (username === 'admin') {
    const demoHash = await bcrypt.hash('admin123', 10);
    const match = await bcrypt.compare(password, demoHash);
    if (match) {
      const token = jwt.sign({ username: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' });
      return res.json({ token });
    }
  }

  return res.status(401).json({ error: 'invalid credentials' });
});

// Example protected endpoint
app.get('/api/admin/stats', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // return demo stats
  res.json({ quotes: 0, applications: 0, inventory: 0 });
});

// Simple in-memory store for demo quotes (replace with DB in production)
const quotesStore = [];

// Create a quote (public)
app.post('/api/quotes', async (req, res) => {
  const data = req.body || {}
  // basic validation
  if (!data.name || !data.email) return res.status(400).json({ error: 'name and email required' })

  const quote = {
    id: quotesStore.length + 1,
    createdAt: new Date().toISOString(),
    ...data
  }

  // push to memory store
  quotesStore.push(quote)

  // try to persist to DB if available
  try {
    const p = await initDb();
    // simple insert into a quotes table if it exists
    await p.query('INSERT INTO quotes (name, email, phone, serviceType, containerSize, quantity, duration, deliveryAddress, message, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [quote.name, quote.email, quote.phone || null, quote.serviceType || null, quote.containerSize || null, quote.quantity || null, quote.duration || null, quote.deliveryAddress || null, quote.message || null, quote.createdAt]).catch(()=>{})
  } catch (_) {
    // ignore DB errors in demo mode
  }

  res.status(201).json({ ok: true, id: quote.id })
})

// Protected: list quotes
app.get('/api/quotes', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // attempt to read from DB first
  try {
    const p = await initDb();
    const [rows] = await p.query('SELECT id, name, email, phone, serviceType, containerSize, quantity, duration, deliveryAddress, message, createdAt FROM quotes ORDER BY createdAt DESC LIMIT 100')
    return res.json({ quotes: rows })
  } catch (err) {
    // fallback to in-memory
    return res.json({ quotes: quotesStore.slice().reverse() })
  }
})

// Database test endpoint
app.get('/api/dbtest', async (req, res) => {
  try {
    const p = await initDb();
    const [rows] = await p.query('SELECT 1 AS ok');
    res.json({ ok: rows[0].ok });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Midway backend listening on port ${PORT}`);
});
