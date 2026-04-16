'use client';
// ── Reusable Glass Card ────────────────────────────────────────────
import { clsx } from 'clsx';

export default function Card({ children, className, glow = false, padding = true }) {
  return (
    <div
      className={clsx(
        'glass-card animate-fade-in',
        padding && 'p-6',
        glow && 'glow-border',
        className
      )}
    >
      {children}
    </div>
  );
}
