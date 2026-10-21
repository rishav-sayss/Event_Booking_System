export default function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
