'use client';
// ── Price Chart ────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, changeColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-bg-elevated border border-bg-border rounded-xl px-3 py-2 shadow-xl">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-mono font-semibold text-slate-100 text-sm">{formatPrice(val)}</div>
    </div>
  );
}

export default function PriceChart({ tokenId }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(30);

  useEffect(() => {
    if (!tokenId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/chart/${encodeURIComponent(tokenId)}?days=${range}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setChartData(data.chartData || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tokenId, range]);

  const isUp = chartData.length >= 2
    ? chartData[chartData.length - 1].price >= chartData[0].price
    : true;

  const strokeColor = isUp ? '#10b981' : '#ef4444';
  const fillStart = isUp ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {isUp
            ? <TrendingUp size={16} className="text-emerald-400" />
            : <TrendingDown size={16} className="text-red-400" />
          }
          <h3 className="font-semibold text-slate-200">Price History</h3>
        </div>
        {/* Range selector */}
        <div className="flex gap-1 bg-bg-elevated rounded-xl p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                range === r.days
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <Skeleton height="h-52" />}
      {error && (
        <div className="h-52 flex items-center justify-center text-slate-500 text-sm">
          Chart unavailable
        </div>
      )}
      {!loading && !error && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
              tickFormatter={(v) => formatPrice(v).replace('$', '$')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fill="url(#priceGrad)"
              dot={false}
              activeDot={{ r: 4, fill: strokeColor, stroke: '#0a0a0f', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
