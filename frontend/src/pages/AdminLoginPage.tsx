import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Ticket, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function AdminLoginPage() {
  const { admin, login, loading } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  if (admin) return <Navigate to="/admin" replace />;
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { await login(email, password); navigate('/admin'); } catch (err) { notify('error', (err as Error).message); } };
  return <div className="container-page flex min-h-[70vh] items-center justify-center py-16"><form onSubmit={submit} className="card w-full max-w-md p-8"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-ink-950"><Ticket className="h-6 w-6" /></span><div><p className="text-xs uppercase tracking-widest text-brand-300">SeatSage</p><h1 className="font-display text-2xl font-bold">Admin access</h1></div></div><p className="mt-6 text-sm text-slate-400">Manage events and monitor bookings from one place.</p><label className="mt-6 block text-xs font-medium text-slate-400"><Mail className="mr-1 inline h-3.5 w-3.5" />Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-2" placeholder="admin@example.com" /></label><label className="mt-4 block text-xs font-medium text-slate-400"><LockKeyhole className="mr-1 inline h-3.5 w-3.5" />Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-2" placeholder="Your password" /></label><button disabled={loading} className="btn-primary mt-6 w-full">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in securely'}</button></form></div>;
}
