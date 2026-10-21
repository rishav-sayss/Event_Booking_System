import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function BookingFailurePage() {
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message || 'We could not complete your booking.';
  const eventId = (location.state as { eventId?: number } | null)?.eventId;
  return <div className="container-page py-20"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto max-w-lg p-10 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/15 text-red-300"><AlertCircle className="h-9 w-9" /></span><h1 className="mt-6 font-display text-3xl font-bold">Booking could not be completed</h1><p className="mt-3 text-slate-400">{message}</p><div className="mt-7 flex justify-center gap-3">{eventId ? <Link to={`/events/${eventId}`} className="btn-primary"><RefreshCw className="h-4 w-4" /> Try again</Link> : null}<Link to="/events" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back to events</Link></div></motion.div></div>;
}
