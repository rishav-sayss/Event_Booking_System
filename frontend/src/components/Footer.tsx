import { Link } from 'react-router-dom';
import { Ticket, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-ink-950">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-ink-950">
              <Ticket className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">
              Seat<span className="text-brand-400">Sage</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            The smart way to discover, book and manage event tickets. Real-time seat availability,
            instant QR tickets, and a frictionless booking experience.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><Link to="/events" className="hover:text-brand-300">All events</Link></li>
            <li><Link to="/admin" className="hover:text-brand-300">Admin dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Connect</h4>
          <div className="mt-4 flex gap-3">
            <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-brand-300 hover:border-brand-400/40">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-brand-300 hover:border-brand-400/40">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-brand-300 hover:border-brand-400/40">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <p className="container-page text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SeatSage. Built for the Smart Event Booking System.
        </p>
      </div>
    </footer>
  );
}
