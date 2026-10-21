-- Smart Event Booking System MySQL schema
-- The events and bookings tables follow the supplied database design exactly.

CREATE DATABASE IF NOT EXISTS event_booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE event_booking_db;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  address VARCHAR(255) NULL,
  city VARCHAR(120) NULL,
  area VARCHAR(120) NULL,
  sector VARCHAR(120) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  date DATETIME NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  img VARCHAR(512) NULL,
  INDEX idx_events_date (date),
  INDEX idx_events_location (location),
  CONSTRAINT chk_events_seats CHECK (total_seats > 0 AND available_seats >= 0 AND available_seats <= total_seats),
  CONSTRAINT chk_events_price CHECK (price >= 0),
  CONSTRAINT chk_events_latitude CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
  CONSTRAINT chk_events_longitude CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
) ENGINE=InnoDB;

SET @add_address = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE events ADD COLUMN address VARCHAR(255) NULL AFTER location', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'address');
PREPARE stmt FROM @add_address; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @add_city = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE events ADD COLUMN city VARCHAR(120) NULL AFTER address', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'city');
PREPARE stmt FROM @add_city; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @add_area = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE events ADD COLUMN area VARCHAR(120) NULL AFTER city', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'area');
PREPARE stmt FROM @add_area; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @add_sector = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE events ADD COLUMN sector VARCHAR(120) NULL AFTER area', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'sector');
PREPARE stmt FROM @add_sector; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @add_latitude = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE events ADD COLUMN latitude DECIMAL(10,7) NULL AFTER sector', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'latitude');
PREPARE stmt FROM @add_latitude; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @add_longitude = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE events ADD COLUMN longitude DECIMAL(10,7) NULL AFTER latitude', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'longitude');
PREPARE stmt FROM @add_longitude; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  mobile VARCHAR(30) NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  CONSTRAINT fk_bookings_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_bookings_event (event_id),
  INDEX idx_bookings_email (email),
  INDEX idx_bookings_status (status),
  CONSTRAINT chk_bookings_quantity CHECK (quantity > 0 AND quantity <= 10),
  CONSTRAINT chk_bookings_amount CHECK (total_amount >= 0)
) ENGINE=InnoDB;

INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
SELECT * FROM (
  SELECT 'Skyline Jazz Nights', 'An open-air evening of contemporary jazz featuring award-winning ensembles under the stars.', 'Riverside Amphitheatre, Mumbai', '2026-11-15 19:30:00', 500, 500, 1500.00, 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg' UNION ALL
  SELECT 'Frontend Futures Conference', 'Two days of deep dives into React, design systems and web performance with industry leaders.', 'Grand Expo Hall, Bengaluru', '2026-12-02 09:00:00', 300, 300, 3500.00, 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg' UNION ALL
  SELECT 'Comedy Underground', 'A late-night stand-up showcase from the sharpest new voices on the circuit.', 'The Basement Club, Delhi', '2026-11-22 21:00:00', 150, 150, 800.00, 'https://images.pexels.com/photos/2601208/pexels-photo-2601208.jpeg' UNION ALL
  SELECT 'City Food Festival', 'Sample dishes from 40+ restaurants, live cooking demos and street-food stalls all afternoon.', 'Central Park Grounds, Pune', '2026-12-18 12:00:00', 1000, 1000, 600.00, 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg' UNION ALL
  SELECT 'Indie Film Premiere: Halcyon', 'Red-carpet premiere followed by a Q&A with the director.', 'Starlight Cinema, Mumbai', '2026-11-28 18:00:00', 220, 220, 1200.00, 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg' UNION ALL
  SELECT 'AI & Robotics Expo', 'Hands-on demos of humanoid robots, autonomous drones and the latest applied AI research.', 'Innovation Arena, Hyderabad', '2026-12-10 10:00:00', 400, 400, 2200.00, 'https://images.pexels.com/photos/3845510/pexels-photo-3845510.jpeg'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM events);
