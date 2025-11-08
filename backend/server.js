import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';

// Try loading .env from a few common locations so the server works whether started
// from the repo root or the backend folder. When debugging DB issues, this log
// helps confirm which .env file was read.
const envLoaded1 = dotenv.config({ path: './backend/.env' });
const envLoaded2 = dotenv.config({ path: './.env' });
const envUsed = (envLoaded1 && !envLoaded1.error) ? './backend/.env' : ((envLoaded2 && !envLoaded2.error) ? './.env' : 'none');
console.log('dotenv loaded from:', envUsed);

const app = express();
app.use(cors());
app.use(express.json());

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Serve uploads through a small streaming endpoint that sets Content-Type
// based on the original filename stored in metadata. This allows uploaded
// files (which multer stores without extensions) to be served with correct
// MIME types so browsers render images/videos correctly without re-uploading.
app.get('/uploads/:name', (req, res) => {
  const name = req.params.name
  if (!name) return res.status(400).end()
  const filePath = path.join(uploadsDir, name)
  if (!fs.existsSync(filePath)) return res.status(404).end()
  try {
    // attempt to read originalName from metadata
    let originalName = null
    try { const metaRaw = fs.readFileSync(path.join(uploadsDir, 'media.json'), 'utf8'); const meta = JSON.parse(metaRaw || '{}'); if (meta[name] && meta[name].originalName) originalName = meta[name].originalName } catch (_) {}
    const contentType = (originalName && mime.lookup(originalName)) || mime.lookup(name) || 'application/octet-stream'
    const stat = fs.statSync(filePath)
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', stat.size)
    const stream = fs.createReadStream(filePath)
    stream.on('error', () => res.status(500).end())
    stream.pipe(res)
  } catch (err) {
    res.status(500).end()
  }
})

// Fallback static serve (in case other tooling wants it)
app.use('/uploads', express.static(uploadsDir));

// Multer setup for media uploads (stores files under backend/uploads)
const upload = multer({ dest: uploadsDir });

const PORT = process.env.PORT || 5001;

// Simple MySQL pool using mysql2/promise
// - `initDb()` lazily creates a pool and returns it. Callers should handle
//   errors (e.g. connection refused) — the server deliberately falls back to
//   in-memory demo stores when DB access fails to keep the demo functional.
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
  // Ensure essential tables exist when a real DB is configured. We attempt
  // to create the `messages` table if it does not exist so the admin UI and
  // public contact form can persist messages to the DB automatically.
  try {
    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) DEFAULT NULL,
        message TEXT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
    // Create quotes table (if not present) to ensure DB can store quote requests
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) DEFAULT NULL,
        serviceType VARCHAR(255) DEFAULT NULL,
        containerSize VARCHAR(255) DEFAULT NULL,
        quantity INT DEFAULT NULL,
        duration VARCHAR(255) DEFAULT NULL,
        deliveryAddress TEXT DEFAULT NULL,
        message TEXT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
  } catch (e) {
    // If table creation fails (e.g. insufficient privileges), we log and
    // continue — the server will still function using the in-memory store.
    console.error('Failed to ensure messages table exists:', e.message || e)
  }
  return pool;
}

// Health
// Simple health endpoint used during development and health checks.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Simple metadata store for uploaded media: stores originalName and tags per filename
const metadataFile = path.join(uploadsDir, 'media.json')
function readMetadata(){
  try { const raw = fs.readFileSync(metadataFile,'utf8'); return JSON.parse(raw || '{}') } catch (_) { return {} }
}
function writeMetadata(data){
  try { fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2)) } catch (e) { console.error('failed to write metadata', e) }
}

// Protected: list, upload, and delete media files used on the site
// Supports optional query param `tag` to filter the returned media.
app.get('/api/media', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  try {
    const all = fs.readdirSync(uploadsDir).filter(f => f !== 'media.json')
    const meta = readMetadata()
    let files = all.map(f => ({ name: f, originalName: meta[f]?.originalName || null, tags: meta[f]?.tags || [], url: `/uploads/${encodeURIComponent(f)}` }))
    const tag = req.query.tag
    if (tag) files = files.filter(x => Array.isArray(x.tags) && x.tags.includes(tag))
    return res.json({ media: files })
  } catch (err) {
    return res.status(500).json({ error: 'failed to read uploads' })
  }
})

// Public: return the active logo (if any) without requiring auth
app.get('/api/public/logo', (req, res) => {
  try {
    const all = fs.readdirSync(uploadsDir).filter(f => f !== 'media.json')
    const meta = readMetadata()
    let files = all.map(f => ({ name: f, originalName: meta[f]?.originalName || null, tags: meta[f]?.tags || [], url: `/uploads/${encodeURIComponent(f)}` }))
    const logos = files.filter(x => Array.isArray(x.tags) && x.tags.includes('logo'))
    if (!logos.length) return res.json({ url: null })
    const first = logos[0]
    return res.json({ url: first.url, name: first.name, originalName: first.originalName })
  } catch (err) {
    return res.status(500).json({ error: 'failed to read uploads' })
  }
})

// Public: return the active hero image (if any) without requiring auth
app.get('/api/public/hero', (req, res) => {
  try {
    const all = fs.readdirSync(uploadsDir).filter(f => f !== 'media.json')
    const meta = readMetadata()
    let files = all.map(f => ({ name: f, originalName: meta[f]?.originalName || null, tags: meta[f]?.tags || [], url: `/uploads/${encodeURIComponent(f)}` }))
    const heroes = files.filter(x => Array.isArray(x.tags) && x.tags.includes('hero'))
    if (!heroes.length) return res.json({ url: null })
    const first = heroes[0]
    return res.json({ url: first.url, name: first.name, originalName: first.originalName })
  } catch (err) {
    return res.status(500).json({ error: 'failed to read uploads' })
  }
})

app.post('/api/media', upload.single('file'), async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  // multer placed file info on req.file
  if (!req.file) return res.status(400).json({ error: 'no file uploaded' })
  // parse optional tags from multipart form field `tags` (JSON string or comma-separated)
  let tags = []
  try {
    if (req.body && req.body.tags) {
      if (typeof req.body.tags === 'string') {
        try { tags = JSON.parse(req.body.tags) } catch (_) {
          // fallback to comma-separated
          tags = req.body.tags.split(',').map(s=>s.trim()).filter(Boolean)
        }
      } else if (Array.isArray(req.body.tags)) tags = req.body.tags
    }
  } catch (e) { tags = [] }

  // record original name and provided tags in metadata
  const meta = readMetadata()
  meta[req.file.filename] = { originalName: req.file.originalname, tags: Array.isArray(tags) ? tags : [] }
  // enforce uniqueness for special tags: only one file can be 'logo' or 'hero'
  try {
    const special = ['logo', 'hero']
    for (const s of special) {
      if (Array.isArray(meta[req.file.filename].tags) && meta[req.file.filename].tags.includes(s)) {
        // remove tag s from all other entries
        for (const k of Object.keys(meta)) {
          if (k === req.file.filename) continue
          if (Array.isArray(meta[k].tags) && meta[k].tags.includes(s)) {
            meta[k].tags = meta[k].tags.filter(t => t !== s)
          }
        }
      }
    }
    // Enforce uniqueness for service:<slug> tags so only one image is assigned per service
    try {
      const svcTags = (meta[req.file.filename].tags || []).filter(t => typeof t === 'string' && t.startsWith('service:'))
      for (const st of svcTags) {
        for (const k of Object.keys(meta)) {
          if (k === req.file.filename) continue
          if (Array.isArray(meta[k].tags) && meta[k].tags.includes(st)) {
            meta[k].tags = meta[k].tags.filter(t => t !== st)
          }
        }
      }
    } catch (e) { console.error('service uniqueness enforcement error', e) }
  } catch (e) { console.error('enforce unique tags error', e) }
  writeMetadata(meta)
  const url = `/uploads/${encodeURIComponent(req.file.filename)}`
  return res.status(201).json({ ok: true, name: req.file.filename, originalName: req.file.originalname, url, tags: meta[req.file.filename].tags })
})

app.delete('/api/media/:name', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const name = req.params.name
  if (!name) return res.status(400).json({ error: 'missing filename' })
  const filePath = path.join(uploadsDir, name)
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    // remove metadata entry if present
    const meta = readMetadata()
    if (meta[name]) { delete meta[name]; writeMetadata(meta) }
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'failed to delete' })
  }
})

// Protected: set tags for a media file (body: { tags: ['logo','hero'] })
app.post('/api/media/:name/tags', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const name = req.params.name
  const tags = Array.isArray(req.body.tags) ? req.body.tags : []
  const filePath = path.join(uploadsDir, name)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'not found' })
  const meta = readMetadata()
  meta[name] = meta[name] || { originalName: null, tags: [] }
  meta[name].tags = tags
  // enforce uniqueness for special tags: only one file can be 'logo' or 'hero'
  try {
    const special = ['logo', 'hero']
    for (const s of special) {
      if (Array.isArray(meta[name].tags) && meta[name].tags.includes(s)) {
        for (const k of Object.keys(meta)) {
          if (k === name) continue
          if (Array.isArray(meta[k].tags) && meta[k].tags.includes(s)) {
            meta[k].tags = meta[k].tags.filter(t => t !== s)
          }
        }
      }
    }
    // Enforce uniqueness for service:<slug> tags so only one image is assigned per service
    try {
      const svcTags = (meta[name].tags || []).filter(t => typeof t === 'string' && t.startsWith('service:'))
      for (const st of svcTags) {
        for (const k of Object.keys(meta)) {
          if (k === name) continue
          if (Array.isArray(meta[k].tags) && meta[k].tags.includes(st)) {
            meta[k].tags = meta[k].tags.filter(t => t !== st)
          }
        }
      }
    } catch (e) { console.error('service uniqueness enforcement error', e) }
  } catch (e) { console.error('enforce unique tags error', e) }
  writeMetadata(meta)
  return res.json({ ok: true, name, tags })
})

// Public: return mapping of service slug -> image url for use on public pages
app.get('/api/public/services-media', (req, res) => {
  try {
    const all = fs.readdirSync(uploadsDir).filter(f => f !== 'media.json')
    const meta = readMetadata()
    let files = all.map(f => ({ name: f, originalName: meta[f]?.originalName || null, tags: meta[f]?.tags || [], url: `/uploads/${encodeURIComponent(f)}` }))
    const map = {}
    for (const file of files) {
      if (!Array.isArray(file.tags)) continue
      for (const t of file.tags) {
        if (typeof t === 'string' && t.startsWith('service:')) {
          const slug = t.replace(/^service:/,'')
          // only include first seen (server enforces uniqueness)
          if (!map[slug]) map[slug] = file.url
        }
      }
    }
    return res.json(map)
  } catch (err) {
    return res.status(500).json({ error: 'failed to read uploads' })
  }
})

// Simple login endpoint (demo only)
// Lightweight demo authentication. This is NOT secure and only intended for
// local development. In production you should replace this with a proper
// authentication provider and secure password storage.
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  // Demo credentials: admin / admin123
  if (username === 'admin') {
    const demoHash = await bcrypt.hash('admin123', 10);
    const match = await bcrypt.compare(password, demoHash);
    if (match) {
      // JWT for demo: short expiry and default secret when not configured.
      const token = jwt.sign({ username: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' });
      return res.json({ token });
    }
  }

  return res.status(401).json({ error: 'invalid credentials' });
});

// Example protected endpoint
// Protected endpoint: returns simple aggregated counts. Prefer DB counts when
// available; otherwise fall back to in-memory demo store sizes so the admin UI
// remains usable when a DB is not configured.
app.get('/api/admin/stats', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  // Try to compute live stats: prefer DB counts, fall back to in-memory stores
  try {
    const p = await initDb();
    // prefer DB counts when DB has data, otherwise fall back to in-memory demo stores
    const [[qrow]] = await p.query('SELECT COUNT(*) AS cnt FROM quotes').catch(()=>[[{cnt:0}]])
    const [[arow]] = await p.query('SELECT COUNT(*) AS cnt FROM applications').catch(()=>[[{cnt:0}]])
    const [[irow]] = await p.query('SELECT COUNT(*) AS cnt FROM inventory').catch(()=>[[{cnt:0}]])
    let quotesCount = qrow?.cnt || 0
    let applicationsCount = arow?.cnt || 0
    let inventoryCount = irow?.cnt || 0

    // If DB is reachable but tables empty, prefer demo in-memory counts if present
    if (quotesCount === 0 && quotesStore.length > 0) quotesCount = quotesStore.length
    if (applicationsCount === 0 && applicationsStore.length > 0) applicationsCount = applicationsStore.length
    if (inventoryCount === 0 && inventoryStore.length > 0) inventoryCount = inventoryStore.length

    return res.json({ quotes: quotesCount, applications: applicationsCount, inventory: inventoryCount })
  } catch (err) {
    // fallback to in-memory counts (useful for local demo and CI)
    return res.json({ quotes: quotesStore.length, applications: applicationsStore.length, inventory: inventoryStore.length })
  }
});

// In-memory demo stores: used when the DB is not configured or to provide
// deterministic demo data for local development. Replace or remove these in
// production in favor of persistent storage.
const quotesStore = [];
const applicationsStore = [
  { id: 1, name: 'Mike Johnson', position: 'Delivery Driver', date: '2025-10-19', status: 'new' },
  { id: 2, name: 'Sarah Williams', position: 'Sales Rep', date: '2025-10-18', status: 'reviewing' }
]

const inventoryStore = [
  { id: 1, type: '20ft Container', condition: 'New', status: 'Available', quantity: 8 },
  { id: 2, type: '40ft Container', condition: 'Used - Good', status: 'Available', quantity: 12 }
]

const ordersStore = [
  { id: 1, customer: 'HomeDepot Supply', product: 'PanelSeal (5 gal)', quantity: 10, date: '2025-10-19', status: 'shipped' },
  { id: 2, customer: "Bob's Roofing", product: 'PanelSeal (1 gal)', quantity: 25, date: '2025-10-18', status: 'processing' }
]

const messagesStore = []

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

// Create a contact message (public)
app.post('/api/messages', async (req, res) => {
  const data = req.body || {}
  if (!data.name || !data.email) return res.status(400).json({ error: 'name and email required' })

  const msg = {
    id: messagesStore.length + 1,
    name: data.name,
    email: data.email,
    subject: data.subject || null,
    message: data.message || null,
    createdAt: new Date().toISOString(),
    status: 'new'
  }

  messagesStore.push(msg)

  // try to persist to DB if available
  try {
    const p = await initDb();
    await p.query('INSERT INTO messages (name,email,subject,message,createdAt,status) VALUES (?,?,?,?,?,?)', [msg.name, msg.email, msg.subject || null, msg.message || null, msg.createdAt, msg.status]).catch(()=>{})
  } catch (_) {
    // ignore DB errors in demo mode
  }

  res.status(201).json({ ok: true, id: msg.id })
})

// Create a job application (public)
app.post('/api/applications', async (req, res) => {
  const data = req.body || {}
  if (!data.name || !data.email) return res.status(400).json({ error: 'name and email required' })

  const application = {
    id: applicationsStore.length + 1,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    position: data.position || null,
    experience: data.experience || null,
    resume: data.resumeName || null,
    date: new Date().toISOString().split('T')[0],
    status: 'new'
  }

  applicationsStore.push(application)

  // try to persist to DB if available
  try {
    const p = await initDb();
    await p.query('INSERT INTO applications (name,email,phone,position,experience,resume,date,status) VALUES (?,?,?,?,?,?,?,?)', [application.name, application.email, application.phone, application.position, application.experience, application.resume, application.date, application.status]).catch(()=>{})
  } catch (_) {}

  res.status(201).json({ ok: true, id: application.id })
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
    // if DB returned rows use them, otherwise fall back to in-memory demo store
    if (Array.isArray(rows) && rows.length > 0) return res.json({ quotes: rows })
    return res.json({ quotes: quotesStore.slice().reverse() })
  } catch (err) {
    // fallback to in-memory
    return res.json({ quotes: quotesStore.slice().reverse() })
  }
})

// Protected: list contact messages
app.get('/api/messages', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }

  try {
    const p = await initDb();
    const [rows] = await p.query('SELECT id, name, email, subject, message, createdAt, status FROM messages ORDER BY createdAt DESC LIMIT 100')
    if (Array.isArray(rows) && rows.length > 0) return res.json({ messages: rows })
    return res.json({ messages: messagesStore.slice().reverse() })
  } catch (err) {
    return res.json({ messages: messagesStore.slice().reverse() })
  }
})

// Protected: update a quote/message status (body: { id, status })
app.put('/api/quotes', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const payload = req.body || {}
  const id = Number(payload.id)
  const status = payload.status
  if (!id) return res.status(400).json({ error: 'missing id' })
  const idx = quotesStore.findIndex(q => Number(q.id) === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  if (status) quotesStore[idx].status = status
  // best-effort DB update if available
  try {
    const p = await initDb()
    await p.query('UPDATE quotes SET status=? WHERE id=?', [quotesStore[idx].status || null, id]).catch(()=>{})
  } catch (e) {}
  return res.json({ ok: true, quote: quotesStore[idx] })
})

// Protected: update a message status (body: { id, status })
app.put('/api/messages', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const payload = req.body || {}
  const id = Number(payload.id)
  const status = payload.status
  if (!id) return res.status(400).json({ error: 'missing id' })
  const idx = messagesStore.findIndex(q => Number(q.id) === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  if (status) messagesStore[idx].status = status
  // best-effort DB update if available
  try {
    const p = await initDb()
    await p.query('UPDATE messages SET status=? WHERE id=?', [messagesStore[idx].status || null, id]).catch(()=>{})
  } catch (e) {}
  return res.json({ ok: true, message: messagesStore[idx] })
})

// Protected endpoints for admin data (inventory, applications, orders)
app.get('/api/inventory', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  try {
    const p = await initDb();
    const [rows] = await p.query('SELECT id, type, condition, status, quantity FROM inventory LIMIT 100')
    if (Array.isArray(rows) && rows.length > 0) return res.json({ inventory: rows })
    return res.json({ inventory: inventoryStore })
  } catch (err) {
    return res.json({ inventory: inventoryStore })
  }
})

// Protected: update an inventory item by id (in-memory and best-effort DB)
app.put('/api/inventory/:id', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const id = Number(req.params.id)
  const payload = req.body || {}
  const idx = inventoryStore.findIndex(i => Number(i.id) === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  // update fields
  inventoryStore[idx] = { ...inventoryStore[idx], ...payload }
  // best-effort DB update
  try {
    const p = await initDb()
    await p.query('UPDATE inventory SET type=?, `condition`=?, status=?, quantity=? WHERE id=?', [inventoryStore[idx].type, inventoryStore[idx].condition, inventoryStore[idx].status, inventoryStore[idx].quantity, id]).catch(()=>{})
  } catch (e) {}
  return res.json({ ok: true, item: inventoryStore[idx] })
})

// Protected: create a new inventory item
app.post('/api/inventory', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const payload = req.body || {}
  const nextId = inventoryStore.length ? (Math.max(...inventoryStore.map(i=>Number(i.id))) + 1) : 1
  const item = {
    id: nextId,
    type: payload.type || 'Unknown',
    condition: payload.condition || '',
    status: payload.status || 'Available',
    quantity: typeof payload.quantity === 'number' ? payload.quantity : (payload.quantity ? Number(payload.quantity) : 0)
  }
  inventoryStore.push(item)
  // best-effort DB insert
  try {
    const p = await initDb()
    await p.query('INSERT INTO inventory (id,type,`condition`,status,quantity) VALUES (?,?,?,?,?)', [item.id, item.type, item.condition, item.status, item.quantity]).catch(()=>{})
  } catch (e) {}
  return res.status(201).json({ ok: true, item })
})

// Protected: delete inventory item
app.delete('/api/inventory/:id', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const id = Number(req.params.id)
  const idx = inventoryStore.findIndex(i => Number(i.id) === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const [removed] = inventoryStore.splice(idx, 1)
  try { const p = await initDb(); await p.query('DELETE FROM inventory WHERE id=?', [id]).catch(()=>{}) } catch(e){}
  return res.json({ ok: true, item: removed })
})

app.get('/api/applications', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  try {
    const p = await initDb();
    const [rows] = await p.query('SELECT id, name, position, date, status FROM applications ORDER BY date DESC LIMIT 100')
    if (Array.isArray(rows) && rows.length > 0) return res.json({ applications: rows })
    return res.json({ applications: applicationsStore })
  } catch (err) {
    return res.json({ applications: applicationsStore })
  }
})

// Protected: update application status
app.patch('/api/applications/:id/status', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const id = Number(req.params.id)
  const status = req.body?.status
  if (!status) return res.status(400).json({ error: 'missing status' })
  const idx = applicationsStore.findIndex(a => Number(a.id) === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  applicationsStore[idx].status = status
  try { const p = await initDb(); await p.query('UPDATE applications SET status=? WHERE id=?', [status, id]).catch(()=>{}) } catch(e){}
  return res.json({ ok: true, application: applicationsStore[idx] })
})

app.get('/api/orders', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  try {
    const p = await initDb();
    const [rows] = await p.query('SELECT id, customer, product, quantity, date, status FROM orders ORDER BY date DESC LIMIT 100')
    if (Array.isArray(rows) && rows.length > 0) return res.json({ orders: rows })
    return res.json({ orders: ordersStore })
  } catch (err) {
    return res.json({ orders: ordersStore })
  }
})

// Protected: update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }
  const id = Number(req.params.id)
  const status = req.body?.status
  if (!status) return res.status(400).json({ error: 'missing status' })
  const idx = ordersStore.findIndex(o => Number(o.id) === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  ordersStore[idx].status = status
  try { const p = await initDb(); await p.query('UPDATE orders SET status=? WHERE id=?', [status, id]).catch(()=>{}) } catch(e){}
  return res.json({ ok: true, order: ordersStore[idx] })
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

// Protected: seed demo data for local development
app.post('/api/admin/seed', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try { jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch (err) { return res.status(401).json({ error: 'unauthorized' }); }

  // Populate in-memory stores
  quotesStore.length = 0
  quotesStore.push({ id: 1, name: 'Demo Customer', email: 'demo@example.com', serviceType: 'rental', containerSize: '20ft', quantity: 1, createdAt: new Date().toISOString(), status: 'pending' })

  applicationsStore.length = 0
  applicationsStore.push({ id: 1, name: 'Mike Johnson', position: 'Delivery Driver', date: '2025-10-19', status: 'new' })
  applicationsStore.push({ id: 2, name: 'Sarah Williams', position: 'Sales Rep', date: '2025-10-18', status: 'reviewing' })

  inventoryStore.length = 0
  inventoryStore.push({ id: 1, type: '20ft Container', condition: 'New', status: 'Available', quantity: 8 })
  inventoryStore.push({ id: 2, type: '40ft Container', condition: 'Used - Good', status: 'Available', quantity: 12 })

  ordersStore.length = 0
  ordersStore.push({ id: 1, customer: 'HomeDepot Supply', product: 'PanelSeal (5 gal)', quantity: 10, date: '2025-10-19', status: 'shipped' })
  ordersStore.push({ id: 2, customer: "Bob's Roofing", product: 'PanelSeal (1 gal)', quantity: 25, date: '2025-10-18', status: 'processing' })

  // Seed demo messages for local development
  messagesStore.length = 0
  messagesStore.push({ id: 1, name: 'Jane Tester', email: 'jane@example.com', subject: 'General question', message: 'Hi — I have a question about availability.', createdAt: new Date().toISOString(), status: 'new' })
  try {
    const p = await initDb()
    await p.query('INSERT INTO messages (name,email,subject,message,createdAt,status) VALUES (?,?,?,?,?,?)', [messagesStore[0].name, messagesStore[0].email, messagesStore[0].subject || null, messagesStore[0].message || null, messagesStore[0].createdAt, messagesStore[0].status]).catch(()=>{})
  } catch (_) {}

  // Try to persist to DB (best-effort, ignore errors)
  try {
    const p = await initDb();
    // Quotes table insert (if exists)
    await p.query("INSERT INTO quotes (name,email,serviceType,containerSize,quantity,createdAt) VALUES (?,?,?,?,?,?)", [quotesStore[0].name, quotesStore[0].email, quotesStore[0].serviceType, quotesStore[0].containerSize, quotesStore[0].quantity, quotesStore[0].createdAt]).catch(()=>{})
    // Applications
    for (const a of applicationsStore) {
      await p.query('INSERT INTO applications (name,position,date,status) VALUES (?,?,?,?)', [a.name, a.position, a.date, a.status]).catch(()=>{})
    }
    // Inventory
    for (const i of inventoryStore) {
      await p.query('INSERT INTO inventory (type,condition,status,quantity) VALUES (?,?,?,?)', [i.type, i.condition, i.status, i.quantity]).catch(()=>{})
    }
    // Orders
    for (const o of ordersStore) {
      await p.query('INSERT INTO orders (customer,product,quantity,date,status) VALUES (?,?,?,?,?)', [o.customer, o.product, o.quantity, o.date, o.status]).catch(()=>{})
    }
  } catch (err) {
    // ignore DB errors in demo seed
  }

  return res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Midway backend listening on port ${PORT}`);
});
