const adminService = require('../services/adminService');

async function login(req, res, next) {
  try {
    const result = await adminService.login(req.body.email, req.body.password);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

async function stats(_req, res, next) {
  try {
    const stats = await adminService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
}

module.exports = { login, stats };
