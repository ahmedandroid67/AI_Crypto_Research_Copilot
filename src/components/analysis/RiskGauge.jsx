'use client';
// ── Risk Score Gauge ───────────────────────────────────────────────
// Animated SVG arc gauge with color gradient based on score.
import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import Card from '@/components/ui/Card';
import { getRiskLevel } from '@/lib/utils';

function Gauge({ score, color }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const radius = 70;
  const cx = 90;
  const cy = 90;
  const startAngle = 205;   // degrees — start from bottom-left
  const endAngle = -25;     // degrees — end at bottom-right
  const totalAngle = 360 - startAngle + endAngle; // ≈ 210 degrees

  function polarToXY(deg, r = radius) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function arcPath(start, end, r = radius) {
    const s = polarToXY(start, r);
    const e = polarToXY(end, r);
    const largeArc = (end - start + 360) % 360 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const progressAngle = startAngle + (animated / 100) * totalAngle;

  return (
    <div className="flex items-center justify-center">
      <svg width="180" height="150" viewBox="0 0 180 150">
        {/* Track arc */}
        <path
          d={arcPath(startAngle, startAngle + totalAngle)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={arcPath(startAngle, progressAngle)}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        {/* Score text */}
        <text x={cx} y={cy + 6} textAnchor="middle" className="font-mono" style={{ fill: color, fontSize: '30px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
          {Math.round(animated)}
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" style={{ fill: '#64748b', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
          out of 100
        </text>
      </svg>
    </div>
  );
}

export default function RiskGauge({ riskScore }) {
  const { score, level, factors } = riskScore;
  const risk = getRiskLevel(score);

  return (
    <Card className="animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${risk.bg} border ${risk.border}`}>
          <ShieldAlert size={15} className={risk.text} />
        </div>
        <h3 className="font-semibold text-slate-200">Risk Score</h3>
        <span className={`ml-auto text-sm font-semibold px-2.5 py-0.5 rounded-lg ${risk.bg} ${risk.text} ${risk.border} border`}>
          {risk.label}
        </span>
      </div>

      <Gauge score={score} color={risk.color} />

      {factors?.length > 0 && (
        <div className="mt-4 space-y-2">
          {factors.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className={`text-xs mt-1 flex-shrink-0 ${risk.text}`}>▸</span>
              {f}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
