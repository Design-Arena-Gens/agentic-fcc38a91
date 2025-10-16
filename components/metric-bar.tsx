type MetricBarProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  annotation: string;
};

export function MetricBar({ label, value, min, max, annotation }: MetricBarProps) {
  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const percentage = Math.round(normalized * 100);

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-900/60 p-4 shadow-inner shadow-slate-950/70">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-teal to-cyan-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">{annotation}</p>
    </div>
  );
}
