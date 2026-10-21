import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function UserAuthPage() {
  const { user, register, userLogin, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  if (user) return <Navigate to={params.get('redirect') || '/events'} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'register') await register(form.name, form.email, form.password);
      else await userLogin(form.email, form.password);
      navigate(params.get('redirect') || '/events');
    } catch (err) { notify('error', (err as Error).message); }
  };

  return <div className="container-page flex min-h-[74vh] items-center justify-center py-16"><div className="grid w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/10 bg-[#211044] shadow-2xl shadow-purple-950/30 md:grid-cols-[.9fr_1.1fr]"><div className="relative hidden overflow-hidden bg-gradient-to-br from-[#7826d5] to-[#3e1a9c] p-10 md:block"><div className="summitra-orbit summitra-orbit-two" /><div className="relative z-10"><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#ffd66b]">SeatSage members</p><h1 className="mt-10 font-display text-5xl font-bold leading-none tracking-[-.06em] text-[#ffd66b]">Your next great memory starts here.</h1><p className="mt-6 max-w-xs leading-7 text-white/70">Create an account to book seats, keep your tickets together, and return to the events you love.</p></div></div><form onSubmit={submit} className="p-7 sm:p-10"><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#b66af4]">Welcome to SeatSage</p><h2 className="mt-3 font-display text-3xl font-bold text-white">{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</h2><p className="mt-2 text-sm text-slate-400">{mode === 'login' ? 'Access your bookings and reserve new seats.' : 'Join the community of event-goers.'}</p>{mode === 'register' && <label className="mt-7 block text-xs text-slate-400"><UserRound className="mr-1 inline h-3.5 w-3.5" />Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input mt-2" placeholder="Jane Doe" /></label>}<label className="mt-5 block text-xs text-slate-400"><Mail className="mr-1 inline h-3.5 w-3.5" />Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input mt-2" placeholder="jane@example.com" /></label><label className="mt-5 block text-xs text-slate-400"><LockKeyhole className="mr-1 inline h-3.5 w-3.5" />Password<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input mt-2" placeholder="At least 8 characters" /></label><button disabled={loading} className="summitra-pill mt-7 w-full justify-between"><span>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</span><span className="summitra-pill-icon"><ArrowRight className="h-5 w-5" /></span></button><button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-5 w-full text-center text-sm text-slate-400 hover:text-white">{mode === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}</button><Link to="/admin/login" className="mt-7 block text-center text-xs text-slate-500 hover:text-[#ffd66b]">Admin access</Link></form></div></div>;
}
