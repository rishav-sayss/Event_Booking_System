import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { admin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-white/5"
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-ink-950 shadow-glow">
            <Ticket className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Seat<span className="text-brand-400">Sage</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {admin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {admin || user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">{admin?.name || user?.name}</span>
              <button onClick={logout} className="btn-ghost !px-3 !py-2 text-xs"><LogOut className="h-4 w-4" /> Sign out</button>
            </div>
          ) : (
            <div className="flex items-center gap-2"><Link to="/login" className="btn-ghost !px-4 !py-2 text-xs">Sign in</Link><Link to="/admin/login" className="btn-primary !px-4 !py-2 text-xs">Admin</Link></div>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="glass border-t border-white/5 md:hidden"
        >
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                {l.label}
              </NavLink>
            ))}
            {admin ? <><NavLink to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5">Dashboard</NavLink><button onClick={() => { logout(); setOpen(false); }} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/5">Sign out</button></> : user ? <button onClick={() => { logout(); setOpen(false); }} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/5">Sign out</button> : <><Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5">Sign in</Link><Link to="/admin/login" onClick={() => setOpen(false)} className="btn-primary mt-2">Admin login</Link></>}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
