const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { AppError } = require('../middleware/error');
const { signUserToken } = require('../middleware/auth');

async function register(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const hash = await bcrypt.hash(password, 12);
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), normalizedEmail, hash]
    );
    const user = { id: result.insertId, name: name.trim(), email: normalizedEmail };
    return { token: signUserToken(user), user };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') throw new AppError('Unable to create account with those details', 409);
    throw err;
  }
}

async function login(email, password) {
  const [rows] = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email.trim().toLowerCase()]);
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
    throw new AppError('Invalid email or password', 401);
  }
  const user = { id: rows[0].id, name: rows[0].name, email: rows[0].email };
  return { token: signUserToken(user), user };
}

module.exports = { register, login };
