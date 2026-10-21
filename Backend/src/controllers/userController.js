const userService = require('../services/userService');

async function register(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await userService.register(req.body.name, req.body.email, req.body.password) });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    res.json({ success: true, data: await userService.login(req.body.email, req.body.password) });
  } catch (err) { next(err); }
}

module.exports = { register, login };
