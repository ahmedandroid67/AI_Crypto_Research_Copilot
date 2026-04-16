'use client';
// ── Badge Component ────────────────────────────────────────────────
import { clsx } from 'clsx';

const variants = {
  default: 'bg-bg-elevated text-slate-300 border-bg-border',
  primary: 'bg-primary/10 text-primary-light border-primary/30',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/10 text-red-400 border-red-500/30',
  bullish: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  bearish: 'bg-red-500/10 text-red-400 border-red-500/30',
  neutral: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
