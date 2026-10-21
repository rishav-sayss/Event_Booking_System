import type { EventItem, Booking, BookingPayload, AdminInfo, AdminStats, EventFilters, UserInfo } from '@/types';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

function buildQuery(filters: EventFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  async listEvents(filters: EventFilters = {}): Promise<EventItem[]> {
    const res = await request<ApiResponse<EventItem[]>>(`/events${buildQuery(filters)}`);
    return res.data;
  },
  async getEvent(id: number | string): Promise<EventItem> {
    const res = await request<ApiResponse<EventItem>>(`/events/${id}`);
    return res.data;
  },
  async createEvent(data: Partial<EventItem>): Promise<EventItem> {
    const res = await request<ApiResponse<EventItem>>(`/events`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  async updateEvent(id: number | string, data: Partial<EventItem>): Promise<EventItem> {
    const res = await request<ApiResponse<EventItem>>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  async deleteEvent(id: number | string): Promise<void> {
    await request<ApiResponse<void>>(`/events/${id}`, { method: 'DELETE' });
  },
  async listCategories(): Promise<string[]> {
    const res = await request<ApiResponse<string[]>>(`/events/categories`);
    return res.data;
  },
  async listCities(): Promise<string[]> {
    const res = await request<ApiResponse<string[]>>(`/events/cities`);
    return res.data;
  },
  async createBooking(data: BookingPayload): Promise<Booking> {
    const res = await request<ApiResponse<Booking>>(`/bookings`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  async getBooking(id: number | string): Promise<Booking> {
    const res = await request<ApiResponse<Booking>>(`/bookings/${id}`);
    return res.data;
  },
  async myBookings(email: string): Promise<Booking[]> {
    const res = await request<ApiResponse<Booking[]>>(`/bookings/my?email=${encodeURIComponent(email)}`);
    return res.data;
  },
  async adminLogin(email: string, password: string): Promise<{ token: string; admin: AdminInfo }> {
    const res = await request<ApiResponse<{ token: string; admin: AdminInfo }>>(`/admin/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
    return res.data;
  },
  async userRegister(name: string, email: string, password: string): Promise<{ token: string; user: UserInfo }> {
    const res = await request<ApiResponse<{ token: string; user: UserInfo }>>(`/auth/register`, { method: 'POST', body: JSON.stringify({ name, email, password }) });
    return res.data;
  },
  async userLogin(email: string, password: string): Promise<{ token: string; user: UserInfo }> {
    const res = await request<ApiResponse<{ token: string; user: UserInfo }>>(`/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
    return res.data;
  },
  async adminStats(): Promise<AdminStats> {
    const res = await request<ApiResponse<AdminStats>>(`/admin/stats`);
    return res.data;
  },
};
