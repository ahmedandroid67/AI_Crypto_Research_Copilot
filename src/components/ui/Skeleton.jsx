'use client';
// ── Skeleton Loader ────────────────────────────────────────────────
import { clsx } from 'clsx';

export function Skeleton({ className, height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={clsx(
        'skeleton rounded-lg',
        height,
        width,
        className
      )}
    />
  );
}

/** Full analysis page skeleton */
export function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Token Header Skeleton */}
      <div className="glass-card p-6 flex items-center gap-4">
        <Skeleton width="w-16" height="h-16" className="rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton width="w-48" height="h-7" />
          <Skeleton width="w-32" height="h-4" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton width="w-28" height="h-8" />
          <Skeleton width="w-20" height="h-4" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-4 space-y-2">
            <Skeleton width="w-20" height="h-3" />
            <Skeleton width="w-24" height="h-6" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="glass-card p-6 space-y-3">
        <Skeleton width="w-32" height="h-5" />
        <Skeleton width="w-full" height="h-48" />
      </div>

      {/* Analysis Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-3">
            <Skeleton width="w-28" height="h-5" />
            <Skeleton width="w-full" height="h-4" />
            <Skeleton width="w-5/6" height="h-4" />
            <Skeleton width="w-4/6" height="h-4" />
          </div>
        ))}
      </div>

      {/* Verdict Skeleton */}
      <div className="glass-card p-6 space-y-3">
        <Skeleton width="w-24" height="h-5" />
        <Skeleton width="w-full" height="h-5" />
        <Skeleton width="w-3/4" height="h-5" />
      </div>
    </div>
  );
}

/** Trending list skeleton */
export function TrendingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton width="w-8" height="h-8" className="rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton width="w-16" height="h-4" />
              <Skeleton width="w-10" height="h-3" />
            </div>
          </div>
          <Skeleton width="w-full" height="h-4" />
        </div>
      ))}
    </div>
  );
}
