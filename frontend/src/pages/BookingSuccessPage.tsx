import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Calendar, MapPin, Ticket } from 'lucide-react';
import type { Booking } from '@/types';
import { api } from '@/lib/api';
import { downloadDataUrl, formatDate, formatPrice } from '@/lib/format';
import Loader from '@/components/Loader';

export default function BookingSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState<Booking | null>((location.state as { booking?: Booking } | null)?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking && id) api.getBooking(id).then(setBooking).finally(() => setLoading(false));
  }, [booking, id]);

  if (loading) return <Loader label="Preparing your ticket…" />;
  if (!booking) return <div className="container-page py-20 text-center">Booking not found.</div>;

  return (
    <div className="container-page py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500/15 text-brand-300"><CheckCircle2 className="h-9 w-9" /></span>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-brand-300">Booking confirmed</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Your seat is saved.</h1>
        <p className="mt-3 text-slate-400">Show this QR ticket at the venue entrance. A copy is ready to download below.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card mx-auto mt-10 max-w-2xl overflow-hidden">
        <div className="border-b border-dashed border-white/10 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs text-slate-500">Event</p><h2 className="mt-1 font-display text-2xl font-bold">{booking.event_title}</h2></div>
            <Ticket className="h-7 w-7 shrink-0 text-brand-400" />
          </div>
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-2 text-slate-300"><Calendar className="h-4 w-4 text-brand-400" />{booking.event_date ? formatDate(booking.event_date) : 'Event date confirmed'}</p>
            <p className="flex items-center gap-2 text-slate-300"><MapPin className="h-4 w-4 text-brand-400" />{booking.venue_name || booking.location || 'Venue details in booking'}</p>
          </div>
        </div>
        <div className="grid gap-8 p-6 sm:grid-cols-[1fr_180px] sm:p-8">
          <div className="space-y-4 text-sm">
            <Row label="Booking ID" value={`#${booking.id}`} />
            <Row label="Name" value={booking.customer_name} />
            <Row label="Tickets" value={String(booking.seats_booked)} />
            <Row label="Total" value={formatPrice(booking.total_amount)} />
          </div>
          {booking.qr_code_data ? <img src={booking.qr_code_data} alt="Booking QR code" className="mx-auto h-44 w-44 rounded-xl bg-white p-2" /> : <div className="text-sm text-slate-500">QR code unavailable</div>}
        </div>
        <div className="flex flex-wrap gap-3 border-t border-white/5 p-6 sm:px-8">
          {booking.qr_code_data && <button onClick={() => downloadDataUrl(booking.qr_code_data!, `seatsage-ticket-${booking.id}.png`)} className="btn-primary"><Download className="h-4 w-4" /> Download QR ticket</button>}
          <Link to="/events" className="btn-ghost">Browse more events</Link>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><span className="text-slate-500">{label}</span><span className="text-right font-medium text-slate-200">{value}</span></div>; }
