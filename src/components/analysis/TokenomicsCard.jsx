'use client';
// ── Tokenomics Card ────────────────────────────────────────────────
import { PieChart, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Card from '@/components/ui/Card';

const healthConfig = {
  healthy: { icon: CheckCircle, text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Healthy' },
  concerning: { icon: AlertTriangle, text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Concerning' },
  risky: { icon: XCircle, text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Risky' },
};

export default function TokenomicsCard({ tokenomics }) {
  const { analysis, supply_health, key_points } = tokenomics;
  const health = healthConfig[supply_health] || healthConfig.concerning;
  const HealthIcon = health.icon;

  return (
    <Card className="animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
          <PieChart size={15} className="text-violet-400" />
        </div>
        <h3 className="font-semibold text-slate-200">Tokenomics</h3>
        <div className={`ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${health.bg} ${health.text} ${health.border}`}>
          <HealthIcon size={12} />
          {health.label}
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed mb-4">{analysis}</p>

      {key_points?.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-bg-border">
          {key_points.map((point, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="text-violet-400 text-xs mt-1 flex-shrink-0">◆</span>
              {point}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
