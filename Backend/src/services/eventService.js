const { pool } = require('../config/db');
const { AppError } = require('../middleware/error');

function buildWhereClause(query) {
  const conditions = [];
  const params = [];
  if (query.search) {
    conditions.push('(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)');
    const like = `%${query.search}%`;
    params.push(like, like, like);
  }
  if (query.location) {
    conditions.push('e.location LIKE ?');
    params.push(`%${query.location}%`);
  }
  if (query.min_price != null) { conditions.push('e.price >= ?'); params.push(Number(query.min_price)); }
  if (query.max_price != null) { conditions.push('e.price <= ?'); params.push(Number(query.max_price)); }
  if (query.date_from) { conditions.push('e.date >= ?'); params.push(query.date_from); }
  if (query.date_to) { conditions.push('e.date <= ?'); params.push(`${query.date_to} 23:59:59`); }
  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

function selectSql() {
  return `SELECT e.id, e.title, e.description, e.location, e.address, e.city, e.area, e.sector, e.latitude, e.longitude, e.date, e.total_seats, e.available_seats, e.price, e.img,
    e.location AS venue_name, e.date AS event_date, e.img AS image_url,
    (e.total_seats - e.available_seats) AS seats_booked,
    (e.available_seats > 0 AND e.date > NOW()) AS is_available
    FROM events e`;
}

async function listEvents(query = {}) {
  const { where, params } = buildWhereClause(query);
  const order = query.sort === 'price_asc' ? 'e.price ASC' : query.sort === 'price_desc' ? 'e.price DESC' : query.sort === 'date_desc' ? 'e.date DESC' : 'e.date ASC';
  const limit = Math.min(Number.parseInt(query.limit, 10) || 50, 200);
  const offset = Math.max(Number.parseInt(query.offset, 10) || 0, 0);
  const [rows] = await pool.query(`${selectSql()} ${where} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  return rows.map(normalizeEvent);
}

async function getEventById(id) {
  const [rows] = await pool.query(`${selectSql()} WHERE e.id = ?`, [id]);
  if (!rows.length) throw new AppError('Event not found', 404);
  return normalizeEvent(rows[0]);
}

async function createEvent(data) {
  const location = data.location || data.address;
  const [result] = await pool.query(
    'INSERT INTO events (title, description, location, address, city, area, sector, latitude, longitude, date, total_seats, available_seats, price, img) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [data.title, data.description, location, data.address || location, data.city || null, data.area || null, data.sector || null, data.latitude ?? null, data.longitude ?? null, data.date || data.event_date, data.total_seats, data.total_seats, data.price, data.img || data.image_url || null]
  );
  return getEventById(result.insertId);
}

async function updateEvent(id, data) {
  await getEventById(id);
  const map = { title: 'title', description: 'description', location: 'location', address: 'address', city: 'city', area: 'area', sector: 'sector', latitude: 'latitude', longitude: 'longitude', date: 'date', price: 'price', img: 'img' };
  const fields = [];
  const params = [];
  for (const [key, column] of Object.entries(map)) {
    if (data[key] !== undefined) { fields.push(`${column} = ?`); params.push(data[key]); }
  }
  if (data.total_seats !== undefined) {
    const [[current]] = await pool.query('SELECT total_seats, available_seats FROM events WHERE id = ?', [id]);
    const booked = current.total_seats - current.available_seats;
    if (data.total_seats < booked) throw new AppError('Cannot reduce seats below already booked quantity', 400);
    fields.push('total_seats = ?', 'available_seats = ?');
    params.push(data.total_seats, data.total_seats - booked);
  }
  if (!fields.length) throw new AppError('No fields to update', 400);
  await pool.query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
  return getEventById(id);
}

async function deleteEvent(id) {
  const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
  if (!result.affectedRows) throw new AppError('Event not found', 404);
}

function normalizeEvent(row) {
  return {
    ...row,
    venue_name: row.venue_name,
    address: row.location,
    city: row.city || row.location?.split(',').pop()?.trim() || row.location,
    area: row.area,
    sector: row.sector,
    event_date: row.event_date,
    image_url: row.image_url,
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
    price: Number(row.price),
    seats_booked: Number(row.seats_booked),
    is_available: Boolean(row.is_available),
    category: 'Event',
  };
}

module.exports = { listEvents, getEventById, createEvent, updateEvent, deleteEvent };
