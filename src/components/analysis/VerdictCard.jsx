'use client';
// ── Verdict Card ───────────────────────────────────────────────────
import { Gavel, Clock, AlertOctagon } from 'lucide-react';
import Card from '@/components/ui/Card';

const horizonLabels = {
  short_term: { label: 'Short Term', sub: '< 1 month' },
  mid_term: { label: 'Mid Term', sub: '1–6 months' },
  long_term: { label: 'Long Term', sub: '6+ months' },
};

export default function VerdictCard({ verdict }) {
  const { recommendation, time_horizon, key_risk } = verdict;
  const horizon = horizonLabels[time_horizon] || horizonLabels.mid_term;

  return (
    <Card glow className="md:col-span-2 animate-slide-up">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Gavel size={15} className="text-primary-light" />
        </div>
        <h3 className="font-semibold text-slate-200">Final Verdict</h3>
        {/* Horizon badge */}
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-xl bg-bg-elevated border border-bg-border text-xs text-slate-400">
          <Clock size={12} />
          <span className="font-medium">{horizon.label}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">{horizon.sub}</span>
        </div>
      </div>

      {/* Main recommendation */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-4">
        <p className="text-slate-200 text-base leading-relaxed font-medium">{recommendation}</p>
      </div>

      {/* Key risk */}
      {key_risk && (
        <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl p-4">
          <AlertOctagon size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Key Risk to Watch</div>
            <p className="text-sm text-slate-400 leading-relaxed">{key_risk}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
