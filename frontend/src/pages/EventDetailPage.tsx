import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, Users, Tag, Loader2 } from 'lucide-react';
import type { EventItem } from '@/types';
import { api } from '@/lib/api';
import { formatDate, formatTime, formatPrice, seatsLeftLabel } from '@/lib/format';
import { joinEventRoom, leaveEventRoom, onSeatUpdate } from '@/lib/socket';
import EventMap from '@/components/EventMap';
import SeatSelector from '@/components/SeatSelector';
import Loader from '@/components/Loader';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/context/AuthContext';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [form, setForm] = useState({ customer_name: user?.name || '', customer_email: user?.email || '', customer_phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) setForm((current) => ({ ...current, customer_name: user.name, customer_email: user.email }));
  }, [user]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getEvent(id)
      .then((e) => {
        setEvent(e);
        setSeats(1);
      })
      .catch(() => notify('error', 'Could not load this event.'))
      .finally(() => setLoading(false));

    const eventId = Number(id);
    joinEventRoom(eventId);
    const off = onSeatUpdate(eventId, (payload) => {
      setEvent((prev) => prev ? {
        ...prev,
        available_seats: payload.available_seats,
        total_seats: payload.total_seats,
        seats_booked: payload.total_seats - payload.available_seats,
      } : prev);
      setSeats((current) => Math.min(current, payload.available_seats));
    });

    return () => {
      leaveEventRoom(eventId);
      off();
    };
  }, [id, notify]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    if (seats > event.available_seats) {
      notify('error', 'Not enough seats available.');
      return;
    }
    setSubmitting(true);
    try {
      const booking = await api.createBooking({
        event_id: event.id,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone || undefined,
        seats_booked: seats,
      });
      navigate(`/booking/success/${booking.id}`, { state: { booking } });
    } catch (err) {
      navigate(`/booking/failure`, {
        state: { message: (err as Error).message, eventId: event.id },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading event…" />;

  if (!event) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg">Event not found.</p>
        <Link to="/events" className="btn-outline mt-4">Back to events</Link>
      </div>
    );
  }

  const soldOut = event.available_seats <= 0;
  const passed = new Date(event.event_date) <= new Date();

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 overflow-hidden sm:h-96">
        <img src={event.image_url || ''} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-page pb-8">
            <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-brand-300">
              <ArrowLeft className="h-4 w-4" /> Back to events
            </Link>
            <span className="chip mt-4 bg-brand-500/15 text-brand-300"><Tag className="h-3.5 w-3.5" /> {event.category}</span>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-balance sm:text-5xl">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: details + map */}
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile icon={Calendar} label="Date" value={formatDate(event.event_date)} />
            <InfoTile icon={Clock} label="Time" value={formatTime(event.event_date)} />
            <InfoTile icon={MapPin} label="Venue" value={`${event.venue_name}, ${event.city}`} />
            <InfoTile icon={Ticket} label="Price" value={formatPrice(event.price)} />
          </div>

          <div>
            <h2 className="font-display text-xl font-bold">About this event</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">{event.description}</p>
          </div>

          {/* Real-time seat indicator */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Users className="h-4 w-4 text-brand-400" /> Live seat availability
              </span>
              <span className={`chip ${soldOut ? 'bg-red-500/20 text-red-300' : 'bg-brand-500/15 text-brand-300'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${soldOut ? 'bg-red-400' : 'bg-brand-400 animate-pulse'}`} />
                {seatsLeftLabel(event.available_seats, event.total_seats)}
              </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                animate={{ width: `${(event.seats_booked / event.total_seats) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {event.total_seats - event.available_seats} of {event.total_seats} seats booked · updates in real time
            </p>
          </div>

          {/* Map */}
          <div>
            <h2 className="mb-3 font-display text-xl font-bold">Venue location</h2>
            <EventMap title={event.title} address={[event.address, event.area, event.city, event.sector].filter(Boolean).join(', ')} latitude={event.latitude} longitude={event.longitude} />
          </div>
        </div>

        {/* Right: booking panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SeatSelector
            max={event.total_seats}
            available={event.available_seats}
            price={event.price}
            value={seats}
            onChange={setSeats}
          />

          <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
            <h3 className="font-display text-lg font-bold">Your details</h3>
            {!user && <div className="rounded-xl border border-[#b66af4]/30 bg-[#b66af4]/10 p-4 text-sm text-slate-300">Please sign in before reserving a seat. <Link to={`/login?redirect=/events/${event.id}`} className="font-semibold text-[#ffd66b] hover:underline">Sign in or register</Link></div>}
            <div>
              <label className="text-xs font-medium text-slate-400">Full name</label>
              <input required readOnly={Boolean(user)} value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="input mt-1.5" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Email</label>
              <input required readOnly={Boolean(user)} type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="input mt-1.5" placeholder="jane@example.com" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Phone (optional)</label>
              <input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className="input mt-1.5" placeholder="+91 98765 43210" />
            </div>

            <button type="submit" disabled={submitting || soldOut || passed || !user} className="btn-primary w-full">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming…</> : soldOut ? 'Sold out' : passed ? 'Event passed' : `Confirm booking · ${formatPrice(seats * event.price)}`}
            </button>
            <p className="text-center text-xs text-slate-500">You won't be charged — this is a demo checkout.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
