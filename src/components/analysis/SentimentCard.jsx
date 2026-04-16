'use client';
// ── Sentiment Card ─────────────────────────────────────────────────
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';
import { SENTIMENT_CONFIG } from '@/lib/constants';

const confidenceBar = { low: 'w-1/3', medium: 'w-2/3', high: 'w-full' };

export default function SentimentCard({ sentiment }) {
  const { direction, confidence, reasoning } = sentiment;
  const config = SENTIMENT_CONFIG[direction] || SENTIMENT_CONFIG.neutral;

  const Icon = direction === 'bullish' ? TrendingUp : direction === 'bearish' ? TrendingDown : Minus;

  return (
    <Card className="animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} border ${config.border}`}>
          <Icon size={15} className={config.text} />
        </div>
        <h3 className="font-semibold text-slate-200">Market Sentiment</h3>
        <span className={`ml-auto text-lg`}>{config.emoji}</span>
      </div>

      {/* Sentiment badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${config.bg} border ${config.border} mb-4`}>
        <Icon size={18} className={config.text} />
        <span className={`text-lg font-bold ${config.text} capitalize`}>{config.label}</span>
      </div>

      {/* Confidence meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Confidence</span>
          <span className="font-semibold capitalize text-slate-400">{confidence}</span>
        </div>
        <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${config.bg.replace('/10', '')} ${confidenceBar[confidence] || 'w-1/2'}`}
            style={{ backgroundColor: config.color, boxShadow: `0 0 8px ${config.color}66` }}
          />
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">{reasoning}</p>
    </Card>
  );
}
