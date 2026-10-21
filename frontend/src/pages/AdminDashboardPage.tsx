import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3, CalendarDays, DollarSign, Edit3, Plus, Trash2, Users, X } from 'lucide-react';
import type { AdminStats, EventItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/format';
import { useToast } from '@/components/Toast';
import Loader from '@/components/Loader';
import LocationPicker from '@/components/LocationPicker';

interface EventForm {
  title: string;
  description: string;
  location: string;
  address: string;
  city: string;
  area: string;
  sector: string;
  date: string;
  total_seats: number;
  price: number;
  img: string;
  latitude: number | null;
  longitude: number | null;
}

const emptyForm: EventForm = { title: '', description: '', location: '', address: '', city: '', area: '', sector: '', date: '', total_seats: 100, price: 0, img: '', latitude: null, longitude: null };

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const { notify } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => Promise.all([api.adminStats(), api.listEvents({ sort: 'date_asc' })]).then(([s, e]) => { setStats(s); setEvents(e); });
  useEffect(() => { if (admin) load().catch((err) => notify('error', err.message)); }, [admin, notify]);
  if (!admin) return <Navigate to="/admin/login" replace />;
  if (!stats) return <Loader label="Loading dashboard…" />;

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (event: EventItem) => { setEditingId(event.id); setForm({ title: event.title, description: event.description, location: event.location || event.address, address: event.address || event.location || '', city: event.city || '', area: event.area || '', sector: event.sector || '', date: toDateTimeLocal(event.date || event.event_date), total_seats: event.total_seats, price: event.price, img: event.img || event.image_url || '', latitude: event.latitude, longitude: event.longitude }); setShowForm(true); };
  const save = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { const payload = { ...form, location: form.address }; if (editingId === null) { await api.createEvent(payload); notify('success', 'Event created.'); } else { await api.updateEvent(editingId, payload); notify('success', 'Event updated.'); } setForm(emptyForm); setEditingId(null); setShowForm(false); await load(); } catch (err) { notify('error', (err as Error).message); } finally { setSaving(false); } };
  const remove = async (id: number) => { if (!window.confirm('Delete this event?')) return; try { await api.deleteEvent(id); notify('success', 'Event deleted.'); await load(); } catch (err) { notify('error', (err as Error).message); } };

  return <div className="container-page py-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-brand-300">Welcome back, {admin.name}</p><h1 className="mt-1 font-display text-4xl font-bold">Admin dashboard</h1></div><button onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" /> Create event</button></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={CalendarDays} label="Total events" value={String(stats.events)} /><Stat icon={Users} label="Confirmed bookings" value={String(stats.bookings)} /><Stat icon={DollarSign} label="Revenue" value={formatPrice(stats.revenue)} /><Stat icon={BarChart3} label="Seats sold" value={String(stats.seatsSold)} /></div>
    <section className="mt-10"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">Event inventory</h2><span className="text-sm text-slate-500">{events.length} listed</span></div><div className="mt-4 overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Event</th><th className="p-4">Date</th><th className="p-4">Seats</th><th className="p-4">Price</th><th className="p-4">Action</th></tr></thead><tbody className="divide-y divide-white/5">{events.map((event) => <tr key={event.id} className="text-slate-300"><td className="p-4 font-medium text-white">{event.title}<span className="block text-xs text-slate-500">{event.location}</span></td><td className="p-4">{formatDate(event.date || event.event_date)}</td><td className="p-4">{event.available_seats}/{event.total_seats}</td><td className="p-4">{formatPrice(event.price)}</td><td className="p-4"><div className="flex items-center gap-1"><button onClick={() => openEdit(event)} className="rounded-lg p-2 text-brand-300 hover:bg-brand-500/10" aria-label={`Edit ${event.title}`}><Edit3 className="h-4 w-4" /></button><button onClick={() => remove(event.id)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10" aria-label={`Delete ${event.title}`}><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div></section>
    <section className="mt-10"><h2 className="font-display text-xl font-bold">Recent bookings</h2><div className="mt-4 space-y-3">{stats.recentBookings.map((booking) => <div key={booking.id} className="card flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-medium text-white">{booking.event_title}</p><p className="text-xs text-slate-500">{booking.customer_name} · {booking.booking_code || `#${booking.id}`}</p></div><div className="text-right"><p className="font-medium text-brand-300">{formatPrice(booking.total_amount)}</p><p className="text-xs text-slate-500">{booking.seats_booked || 0} ticket(s)</p></div></div>)}</div></section>
    {showForm && <div className="fixed inset-0 z-[80] grid place-items-center bg-ink-950/80 p-4 backdrop-blur-sm"><form onSubmit={save} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-ink-900 p-6"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">{editingId === null ? 'Create event' : 'Edit event'}</h2><button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}><X className="h-5 w-5 text-slate-400" /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required /><Field label="Full address" value={form.address} onChange={(v) => setForm({ ...form, address: v, location: v })} required /><Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required /><Field label="Area" value={form.area} onChange={(v) => setForm({ ...form, area: v })} /><Field label="Sector" value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} /><Field label="Date and time" type="datetime-local" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required /><Field label="Image URL" value={form.img} onChange={(v) => setForm({ ...form, img: v })} /><Field label="Total seats" type="number" value={String(form.total_seats)} onChange={(v) => setForm({ ...form, total_seats: Number(v) })} required /><Field label="Price" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} required /><Field label="Latitude" type="number" value={form.latitude === null ? '' : String(form.latitude)} onChange={(v) => setForm({ ...form, latitude: v === '' ? null : Number(v) })} /><Field label="Longitude" type="number" value={form.longitude === null ? '' : String(form.longitude)} onChange={(v) => setForm({ ...form, longitude: v === '' ? null : Number(v) })} /></div><LocationPicker latitude={form.latitude} longitude={form.longitude} onChange={(latitude, longitude) => setForm({ ...form, latitude, longitude })} /><label className="mt-4 block text-xs text-slate-400">Description<textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input mt-2 min-h-28" /></label><button disabled={saving} className="btn-primary mt-6 w-full">{saving ? 'Saving…' : editingId === null ? 'Publish event' : 'Save changes'}</button></form></div>}
  </div>;
}
function toDateTimeLocal(value: string): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function Stat({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) { return <div className="card p-5"><Icon className="h-5 w-5 text-brand-400" /><p className="mt-4 text-2xl font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>; }
function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="block text-xs text-slate-400">{label}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input mt-2" /></label>; }
