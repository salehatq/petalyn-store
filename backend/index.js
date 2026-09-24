require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' }
});

app.use('/api', generalLimiter);
app.use('/api/login', loginLimiter);

const { ensureCsrfCookie } = require('./middleware/csrf');
app.use('/api', ensureCsrfCookie);

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'petalyn-api',
    message: 'Petalyn API is running'
  });
});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'petalyn-api', environment: process.env.NODE_ENV || 'development' }));

app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/adminRoutes'));
app.use('/api', require('./routes/orderRoutes'));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message === 'Origin is not allowed by CORS') return res.status(403).json({ message: 'Origin is not allowed' });
  const status = err.status || (err.name === 'MulterError' ? 400 : 500);
  const message = status >= 500 && isProduction ? 'Internal server error' : (err.message || 'Internal server error');
  res.status(status).json({ message });
});

const port = Number(process.env.PORT) || 3000;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
  app.listen(port, () => console.log(`Petalyn API listening on port ${port}`));
}

start().catch(error => {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
});
