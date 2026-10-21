const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const config = require('./config');
const { pool } = require('./config/db');
const { initSocket } = require('./config/socket');
const { ensureAdmin } = require('./config/bootstrap');
const { notFound, errorHandler } = require('./middleware/error');
const logger = require('./utils/logger');

const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: config.apiBase, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

initSocket(server, config.apiBase);

const PORT = config.port;

async function start() {
  try {
    await pool.query('SELECT 1');
    logger.info('Connected to MySQL database');
    await ensureAdmin();
    server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Failed to start server: ' + err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
