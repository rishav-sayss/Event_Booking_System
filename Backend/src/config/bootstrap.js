const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const config = require('../config');
const logger = require('../utils/logger');

async function ensureAdmin() {
  try {
    const [rows] = await pool.query('SELECT id FROM admins WHERE email = ?', [config.admin.email]);
    if (rows.length > 0) return;

    const hash = await bcrypt.hash(config.admin.password, 10);
    await pool.query(
      'INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)',
      [config.admin.name, config.admin.email, hash]
    );
    logger.info(`Bootstrap admin created: ${config.admin.email}`);
  } catch (err) {
    logger.error('Failed to bootstrap admin: ' + err.message);
  }
}

module.exports = { ensureAdmin };
