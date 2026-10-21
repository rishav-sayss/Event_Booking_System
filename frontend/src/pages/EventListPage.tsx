import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Tag, Calendar } from 'lucide-react';
import type { EventItem, EventFilters } from '@/types';
import { api } from '@/lib/api';
import EventCard from '@/components/EventCard';
import Loader from '@/components/Loader';

const SORT_OPTIONS: { value: EventFilters['sort']; label: string }[] = [
  { value: 'date_asc', label: 'Date (soonest)' },
  { value: 'date_desc', label: 'Date (latest)' },
  { value: 'price_asc', label: 'Price (low to high)' },
  { value: 'price_desc', label: 'Price (high to low)' },
  { value: 'newest', label: 'Newest first' },
];

export default function EventListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<EventFilters>({ sort: 'date_asc' });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    Promise.all([api.listCategories(), api.listCities()])
      .then(([cats, cits]) => {
        setCategories(cats);
        setCities(cits);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api
        .listEvents(filters)
        .then(setEvents)
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  const activeCount = useMemo(
    () => [filters.category, filters.city, filters.min_price, filters.max_price, filters.date_from, filters.date_to].filter(Boolean).length,
    [filters]
  );

  const update = (patch: Partial<EventFilters>) => setFilters((f) => ({ ...f, ...patch }));

  const onSearch = (v: string) => {
    setSearchInput(v);
    update({ search: v || undefined });
  };

  const clearAll = () => {
    setSearchInput('');
    setFilters({ sort: 'date_asc' });
  };

  return (
    <div className="container-page py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-4xl font-bold">Explore events</h1>
        <p className="mt-2 text-slate-400">Search, filter and book the experiences you love.</p>
      </motion.div>

      {/* Search + filter toggle */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={searchInput}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by title, venue or description…"
            className="input !pl-11"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="btn-ghost relative"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeCount > 0 && (
            <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-xs text-ink-950">{activeCount}</span>
          )}
        </button>
        <select
          value={filters.sort || 'date_asc'}
          onChange={(e) => update({ sort: e.target.value as EventFilters['sort'] })}
          className="input sm:w-56"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-4 overflow-hidden"
        >
          <div className="card grid gap-5 p-6 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><Tag className="h-3.5 w-3.5" /> Category</label>
              <select value={filters.category || ''} onChange={(e) => update({ category: e.target.value || undefined })} className="input mt-2">
                <option value="">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><MapPin className="h-3.5 w-3.5" /> City</label>
              <select value={filters.city || ''} onChange={(e) => update({ city: e.target.value || undefined })} className="input mt-2">
                <option value="">All cities</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Min price</label>
              <input type="number" min={0} placeholder="0" value={filters.min_price ?? ''} onChange={(e) => update({ min_price: e.target.value ? Number(e.target.value) : undefined })} className="input mt-2" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Max price</label>
              <input type="number" min={0} placeholder="∞" value={filters.max_price ?? ''} onChange={(e) => update({ max_price: e.target.value ? Number(e.target.value) : undefined })} className="input mt-2" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><Calendar className="h-3.5 w-3.5" /> From date</label>
              <input type="date" value={filters.date_from || ''} onChange={(e) => update({ date_from: e.target.value || undefined })} className="input mt-2" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">To date</label>
              <input type="date" value={filters.date_to || ''} onChange={(e) => update({ date_to: e.target.value || undefined })} className="input mt-2" />
            </div>

            <div className="flex items-end">
              <button onClick={clearAll} className="btn-ghost w-full">
                <X className="h-4 w-4" /> Clear filters
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="mt-8">
        {loading ? (
          <Loader label="Finding events…" />
        ) : events.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-20 text-center">
            <Search className="h-10 w-10 text-slate-600" />
            <p className="text-lg font-semibold">No events match your filters</p>
            <button onClick={clearAll} className="btn-outline mt-2">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-slate-400">{events.length} event{events.length !== 1 ? 's' : ''} found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
