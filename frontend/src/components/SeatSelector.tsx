import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import { formatPrice, seatsLeftLabel } from '@/lib/format';

interface Props {
  max: number;
  available: number;
  price: number;
  value: number;
  onChange: (n: number) => void;
}

export default function SeatSelector({ max, available, price, value, onChange }: Props) {
  const effectiveMax = Math.min(max, Math.max(available, 0));
  const total = value * price;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Select tickets</h3>
        <span className={`chip ${available === 0 ? 'bg-red-500/20 text-red-300' : 'bg-brand-500/15 text-brand-300'}`}>
          {seatsLeftLabel(available, max)}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 hover:border-brand-400/40 disabled:opacity-40"
          aria-label="Decrease seats"
        >
          <Minus className="h-4 w-4" />
        </button>
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 text-center"
        >
          <p className="font-display text-3xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-400">ticket{value !== 1 ? 's' : ''}</p>
        </motion.div>
        <button
          type="button"
          onClick={() => onChange(Math.min(effectiveMax, value + 1))}
          disabled={value >= effectiveMax}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 hover:border-brand-400/40 disabled:opacity-40"
          aria-label="Increase seats"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {Array.from({ length: Math.min(effectiveMax, 6) }).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`relative h-9 w-9 rounded-lg text-sm font-medium transition ${
                value === n
                  ? 'bg-brand-500 text-ink-950'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-400/40'
              }`}
            >
              {n}
              {value === n && <Check className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-ink-950 p-0.5 text-brand-400" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={total}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-6 flex items-center justify-between border-t border-white/5 pt-5"
        >
          <div>
            <p className="text-xs text-slate-400">{value} × {formatPrice(price)}</p>
            <p className="font-display text-2xl font-bold text-white">{formatPrice(total)}</p>
          </div>
          <p className="text-xs text-slate-500">Total payable</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
