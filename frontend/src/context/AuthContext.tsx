import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AdminInfo, UserInfo } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  admin: AdminInfo | null;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  userLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo | null>(() => readStored<AdminInfo>('admin_info'));
  const [user, setUser] = useState<UserInfo | null>(() => readStored<UserInfo>('user_info'));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token') || localStorage.getItem('user_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token') || localStorage.getItem('user_token'));
  }, [admin, user]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await api.adminLogin(email, password);
      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('admin_info', JSON.stringify(result.admin));
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_info');
      setAdmin(result.admin);
      setUser(null);
    } finally { setLoading(false); }
  }, []);

  const userLogin = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await api.userLogin(email, password);
      localStorage.setItem('user_token', result.token);
      localStorage.setItem('user_info', JSON.stringify(result.user));
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_info');
      setUser(result.user);
      setAdmin(null);
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await api.userRegister(name, email, password);
      localStorage.setItem('user_token', result.token);
      localStorage.setItem('user_info', JSON.stringify(result.user));
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_info');
      setUser(result.user);
      setAdmin(null);
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    setToken(null);
    setAdmin(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ admin, user, token, loading, login, register, userLogin, logout }), [admin, user, token, loading, login, register, userLogin, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function readStored<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) return null;
  try { return JSON.parse(value) as T; } catch { localStorage.removeItem(key); return null; }
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
