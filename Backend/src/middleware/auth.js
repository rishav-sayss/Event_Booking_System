const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('./error');

function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Authentication required', 401));

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.role !== 'admin') return next(new AppError('Admin access required', 403));
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
}

function userAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Authentication required', 401));
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.role !== 'user') return next(new AppError('User access required', 403));
    req.user = { id: payload.sub, name: payload.name, email: payload.email };
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
}

function signAdminToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email, role: 'admin' }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

function signUserToken(user) {
  return jwt.sign({ sub: user.id, name: user.name, email: user.email, role: 'user' }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

module.exports = { adminAuth, userAuth, signAdminToken, signUserToken };
