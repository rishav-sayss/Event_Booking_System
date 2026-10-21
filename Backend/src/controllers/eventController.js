const eventService = require('../services/eventService');

async function list(req, res, next) { try { const events = await eventService.listEvents(req.query); res.json({ success: true, count: events.length, data: events }); } catch (err) { next(err); } }
async function detail(req, res, next) { try { res.json({ success: true, data: await eventService.getEventById(req.params.id) }); } catch (err) { next(err); } }
async function create(req, res, next) { try { res.status(201).json({ success: true, data: await eventService.createEvent(req.body) }); } catch (err) { next(err); } }
async function update(req, res, next) { try { res.json({ success: true, data: await eventService.updateEvent(req.params.id, req.body) }); } catch (err) { next(err); } }
async function remove(req, res, next) { try { await eventService.deleteEvent(req.params.id); res.json({ success: true, message: 'Event deleted' }); } catch (err) { next(err); } }
async function categories(_req, res) { res.json({ success: true, data: ['Event'] }); }
async function cities(_req, res, next) { try { const events = await eventService.listEvents({ limit: 200 }); const cities = [...new Set(events.map((event) => event.city))].sort(); res.json({ success: true, data: cities }); } catch (err) { next(err); } }
module.exports = { list, detail, create, update, remove, categories, cities };
