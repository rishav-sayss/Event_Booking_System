import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Ticket } from 'lucide-react';
import type { EventItem } from '@/types';
import { formatPrice, formatDate, formatTime, seatsLeftLabel } from '@/lib/format';

export default function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const soldOut = event.available_seats <= 0;
  const fillPct = Math.round((event.seats_booked / event.total_seats) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -6 }}
      className="card group overflow-hidden hover:border-brand-400/30 hover:shadow-card"
    >
      <Link to={`/events/${event.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
          <span className="chip absolute left-3 top-3 bg-ink-950/70 text-brand-300 backdrop-blur">
            {event.category}
          </span>
          {soldOut ? (
            <span className="chip absolute right-3 top-3 bg-red-500/80 text-white backdrop-blur">
              Sold out
            </span>
          ) : (
            <span className="chip absolute right-3 top-3 bg-brand-500/85 text-ink-950 backdrop-blur">
              {seatsLeftLabel(event.available_seats, event.total_seats)}
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-bold leading-snug text-white line-clamp-2 group-hover:text-brand-300">
            {event.title}
          </h3>
          <div className="mt-3 space-y-1.5 text-sm text-slate-400">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-400" />
              {formatDate(event.event_date)} · {formatTime(event.event_date)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-400" />
              {event.venue_name}, {event.city}
            </p>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{fillPct}% booked</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Ticket className="h-3.5 w-3.5" /> {event.total_seats - event.available_seats}/{event.total_seats}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                initial={{ width: 0 }}
                whileInView={{ width: `${fillPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Starting from</p>
              <p className="font-display text-xl font-bold text-white">{formatPrice(event.price)}</p>
            </div>
            <span className="btn-outline !px-4 !py-2 text-xs group-hover:bg-brand-500/15">
              View details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
