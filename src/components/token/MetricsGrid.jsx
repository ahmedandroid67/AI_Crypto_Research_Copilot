'use client';
// ── Key Metrics Grid ───────────────────────────────────────────────
import { DollarSign, BarChart3, Coins, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatMarketCap, formatSupply, formatPrice, formatChange, changeColor, formatDate } from '@/lib/utils';

function MetricCard({ icon: Icon, label, value, subValue, subClass, accent }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-2 hover:border-primary/30 transition-all duration-200 group">
      <div className="flex items-center gap-2 text-slate-500">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent || 'bg-primary/10'}`}>
          <Icon size={14} className="text-primary-light" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="font-mono font-semibold text-slate-100 text-base leading-tight">{value}</div>
      {subValue && <div className={`text-xs font-medium ${subClass || 'text-slate-500'}`}>{subValue}</div>}
    </div>
  );
}

export default function MetricsGrid({ token }) {
  const supplyPct = token.circulatingSupply && token.maxSupply
    ? ((token.circulatingSupply / token.maxSupply) * 100).toFixed(1)
    : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-slide-up">
      <MetricCard
        icon={DollarSign}
        label="Market Cap"
        value={formatMarketCap(token.marketCap)}
        subValue={token.fullyDilutedValuation ? `FDV: ${formatMarketCap(token.fullyDilutedValuation)}` : null}
        subClass="text-slate-500"
      />
      <MetricCard
        icon={BarChart3}
        label="24h Volume"
        value={formatMarketCap(token.volume24h)}
        subValue={token.marketCap ? `${((token.volume24h / token.marketCap) * 100).toFixed(2)}% of M.Cap` : null}
        subClass="text-slate-500"
      />
      <MetricCard
        icon={Coins}
        label="Circulating Supply"
        value={formatSupply(token.circulatingSupply)}
        subValue={supplyPct ? `${supplyPct}% of max` : (token.maxSupply === null ? 'Unlimited supply' : null)}
        subClass={supplyPct > 80 ? 'text-emerald-400' : supplyPct > 50 ? 'text-amber-400' : 'text-slate-500'}
      />
      <MetricCard
        icon={Activity}
        label="30d Change"
        value={formatChange(token.priceChange30d)}
        subClass={changeColor(token.priceChange30d)}
        subValue={`ATH: ${formatPrice(token.ath)}`}
      />
      <MetricCard
        icon={token.athChangePercent > -10 ? TrendingUp : TrendingDown}
        label="From ATH"
        value={token.athChangePercent ? `${token.athChangePercent.toFixed(1)}%` : 'N/A'}
        subValue={formatDate(token.athDate)}
        subClass={token.athChangePercent > -20 ? 'text-emerald-400' : token.athChangePercent > -50 ? 'text-amber-400' : 'text-red-400'}
      />
      <MetricCard
        icon={Coins}
        label="Max Supply"
        value={token.maxSupply ? formatSupply(token.maxSupply) : 'Unlimited ∞'}
        subValue={token.totalSupply && token.totalSupply !== token.maxSupply ? `Total: ${formatSupply(token.totalSupply)}` : null}
        subClass="text-slate-500"
      />
    </div>
  );
}
