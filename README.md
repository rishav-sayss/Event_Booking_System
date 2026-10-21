# SeatSage Smart Event Booking System

SeatSage is a responsive event discovery and booking application with a React frontend and a Node.js/Express backend. It follows the supplied MySQL design for `events` and `bookings`, prevents overbooking with transactions and row locks, broadcasts live seat changes with Socket.IO, and provides an admin dashboard for event management.

## Features

- Landing page with animated hero, parallax motion, featured events and responsive layout
- Event listing with search, sorting, city, price and date filters
- Event details with live seat availability and responsive OpenStreetMap venue maps
- Booking form with validation, transaction-safe seat reservation and QR ticket generation
- Animated booking success and failure states
- Downloadable QR ticket after confirmation
- Admin login with JWT authentication
- Admin dashboard with event creation, deletion, booking metrics and recent bookings
- MySQL schema matching the supplied design
- Socket.IO seat availability updates
- Vercel SPA configuration for frontend deployment

## Folder structure

```text
project-root/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── vercel.json
│   └── package.json
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validation/
│   ├── database/event_booking.sql
│   ├── .env
│   └── package.json
└── README.md
```

## Requirements

- Node.js 18 or newer
- MySQL 8 or newer
- No map key or billing account is required; venue maps use OpenStreetMap tiles

### Database Configuration (AlwaysData MySQL)

SeatSage uses a **MySQL database hosted on AlwaysData** for storing event information, user accounts, bookings, and admin data.

The backend connects to the hosted database using environment variables defined in `Backend/.env`.

Example configuration:

```env
DB_HOST=your_alwaysdata_mysql_host
DB_PORT=3306
DB_USER=your_alwaysdata_username
DB_PASSWORD=your_alwaysdata_password
DB_NAME=your_alwaysdata_database_name
```

Replace these example values with the actual connection details available in your AlwaysData account. The exact variable names must match those used by the backend configuration.

**Database setup and deployment:**

1. Create or use your existing MySQL database in AlwaysData.
2. Verify that the required tables exist: `admins`, `users`, `events`, and `bookings`.
3. If the schema needs updating, apply the required SQL changes to the existing AlwaysData database after checking its current structure.
4. Add the database credentials to the Render backend's Environment Variables settings.
5. Deploy or restart the backend and verify that it connects successfully to AlwaysData.

**Important:** The production backend should connect to the existing AlwaysData database. Do not create or import a separate database unnecessarily, and do not run the SQL setup script blindly against a database containing existing data.

Keep database credentials private. Never expose them in frontend environment variables or commit them to GitHub.

## Backend installation

```bash
cd Backend
npm install
cp .env.example .env
```

Update the backend environment file with your local MySQL connection values and a strong JWT secret. The server creates the configured admin account on its first successful connection if it does not already exist.

Start the backend:

```bash
npm start
```

The default API address is `http://localhost:5000`.

## Frontend installation

```bash
cd frontend
npm install
cp .env .env
```

Set the API and Socket.IO addresses for the backend. Venue maps use OpenStreetMap and require no API key.

Build the frontend:

```bash
npm run build
```

## API documentation

The frontend uses `/api` routes. The backend also exposes the same event and booking endpoints at the exact root paths `/events` and `/bookings` for compatibility with the supplied API specification.

### Events

- `GET /api/events` — list events. Supports `search`, `location`, `min_price`, `max_price`, `date_from`, `date_to`, `sort`, `limit`, and `offset`.
- `GET /api/events/:id` — get one event.
- `POST /api/events` — create an event. Requires an admin Bearer token.
- `PUT /api/events/:id` — update an event. Requires an admin Bearer token.
- `DELETE /api/events/:id` — delete an event. Requires an admin Bearer token.

Create or update event body:

```json
{
  "title": "Frontend Futures",
  "description": "A practical web conference.",
  "location": "Grand Expo Hall, Bengaluru",
  "address": "Grand Expo Hall",
  "city": "Bengaluru",
  "area": "Whitefield",
  "sector": "ITPL Main Road",
  "latitude": 12.9698,
  "longitude": 77.7500,
  "date": "2026-12-02T09:00:00",
  "total_seats": 300,
  "price": 3500,
  "img": "https://example.com/event.jpg"
}
```

### User authentication

- `POST /api/auth/register` — create a customer account with `{ name, email, password }`.
- `POST /api/auth/login` — sign in with `{ email, password }` and receive a JWT.

Customer passwords are hashed on the server. Booking endpoints require the customer JWT, and the server takes the customer name and email from the authenticated session instead of trusting the browser.

### Bookings

- `POST /api/bookings` — reserve tickets. Requires a customer Bearer token. The accepted body is `{ event_id, customer_phone, seats_booked }` plus the authenticated customer identity.

- `GET /api/bookings/:id` — retrieve a booking.
- `GET /api/bookings/my` — list the authenticated customer's bookings.

The booking operation locks the event row, checks the current availability, inserts the booking, decreases `available_seats`, and commits all changes together. If there are not enough seats, the operation returns a conflict and no booking is created.

### Admin Login and Configuration
The application includes an admin login system with JWT authentication. The default admin credentials are configured through environment variables.

Add the following variables to `Backend/.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@1234
```

- Use `admin@example.com` as the default admin email.
- Use `change_me_admin_password` as the default admin password for initial configuration.
- You can change the admin email and password at any time by updating these environment variables.
- After changing the variables, restart or redeploy the backend for the changes to take effect.
- The backend creates the configured admin account on its first successful database connection if the account does not already exist.

**Security notes:**
- Replace the default password with a strong, unique password before deployment.
- Admin passwords should be stored as bcrypt hashes in the database.
- Never commit `.env` files or real credentials to GitHub.
- Configure the same environment variables in your hosting provider's dashboard, such as Render.

## Deployment

### Frontend on Vercel

1. Create a Vercel project using the `frontend` directory as the root directory.
2. Set the frontend environment values from `frontend/.env.example` in Vercel.
3. Deploy. `frontend/vercel.json` rewrites client-side routes to `index.html`.

### Backend on Render, Railway, Fly.io, or another Node host

1. Deploy the `Backend` directory as a Node.js service.
2. Configure the variables from `Backend/.env.example`.
3. Provision a MySQL 8 database and import `Backend/database/event_booking.sql`.
4. Set the frontend API and Socket.IO addresses to the deployed backend address.
5. Allow the deployed frontend origin in the backend CORS configuration.

The backend must run on a host that supports long-lived WebSocket connections for live seat updates. If WebSockets are unavailable, normal booking and event APIs still work, but clients will not receive live seat events.

## Verification checklist

- Run `npm run typecheck` and `npm run build` inside `frontend`.
- Confirm `GET /health` returns `{ "success": true, "status": "ok" }`.
- Open the event listing, filter events, open an event, and complete a booking.
- Confirm the booking decreases `events.available_seats` and returns a QR ticket.
- Log in through `/admin/login`, create an event, select its location on the map, and verify the same marker appears on its details page.
