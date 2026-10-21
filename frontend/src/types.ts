export interface EventItem {
  id: number;
  title: string;
  description: string;
  category: string;
  venue_name: string;
  address: string;
  city: string;
  area: string | null;
  sector: string | null;
  latitude: number | null;
  longitude: number | null;
  event_date: string;
  end_date: string | null;
  price: number;
  total_seats: number;
  available_seats: number;
  seats_booked: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  location?: string;
  date?: string;
  img?: string | null;
}

export interface Booking {
  id: number;
  booking_code: string;
  event_id: number;
  event_title?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  seats_booked: number;
  total_amount: number;
  status: 'confirmed' | 'cancelled' | 'failed';
  qr_code_data?: string;
  created_at: string;
  venue_name?: string;
  location?: string;
  address?: string;
  city?: string;
  event_date?: string;
}

export interface BookingPayload {
  event_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  seats_booked: number;
}

export interface AdminInfo {
  id: number;
  name: string;
  email: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface AdminStats {
  events: number;
  bookings: number;
  revenue: number;
  seatsSold: number;
  recentBookings: Array<{
    id: number;
    booking_code: string;
    customer_name: string;
    customer_email: string;
    seats_booked: number;
    total_amount: number;
    status: string;
    created_at: string;
    event_title: string;
  }>;
}

export interface EventFilters {
  search?: string;
  category?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  date_from?: string;
  date_to?: string;
  sort?: 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc' | 'newest';
}
