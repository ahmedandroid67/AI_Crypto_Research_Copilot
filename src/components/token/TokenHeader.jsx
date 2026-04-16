'use client';
// ── Token Header ───────────────────────────────────────────────────
import { Star, TrendingUp, AlertCircle, TrendingDown, ExternalLink } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatChange, changeColor } from '@/lib/utils';

export default function TokenHeader({ token }) {
  const { toggleWatchlist, isInWatchlist, isClient } = useWatchlist();
  if (!token) return null;
  const change = token.priceChange24h;
  const changeClass = changeColor(change);

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start gap-4">
        {/* Token Image */}
        <div className="relative flex-shrink-0">
          {token.image ? (
            <img
              src={token.image}
              alt={token.name}
              width={64}
              height={64}
              className="rounded-full ring-2 ring-bg-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
              <span className="text-xl font-bold text-primary-light">
                {token.symbol?.[0]}
              </span>
            </div>
          )}
          {/* Rank badge */}
          {token.marketCapRank && (
            <div className="absolute -bottom-1 -right-1 bg-bg-elevated border border-bg-border rounded-full px-1.5 py-0.5 text-xs font-mono text-slate-400">
              #{token.marketCapRank}
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-100">{token.name}</h1>
            <span className="text-sm font-mono text-slate-500 bg-bg-elevated px-2 py-0.5 rounded-md">
              {token.symbol}
            </span>
            {isClient && (
              <button
                onClick={() => toggleWatchlist(token)}
                className={`ml-2 p-1.5 rounded-lg transition-all duration-200 ${
                  isInWatchlist(token.id)
                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    : 'bg-bg-elevated text-slate-400 border border-bg-border hover:bg-slate-800 hover:text-slate-300'
                }`}
                aria-label="Toggle Watchlist"
                title={isInWatchlist(token.id) ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                <Star size={16} fill={isInWatchlist(token.id) ? "currentColor" : "none"} />
              </button>
            )}
          </div>

          {/* Categories */}
          {token.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {token.categories.slice(0, 3).map((cat) => (
                <Badge key={cat} variant="default" className="text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-bold font-mono text-slate-100">
            {formatPrice(token.price)}
          </div>
          <div className={`text-sm font-semibold mt-1 ${changeClass}`}>
            {formatChange(change)} (24h)
          </div>
          {token.priceChange7d !== undefined && (
            <div className={`text-xs mt-0.5 ${changeColor(token.priceChange7d)}`}>
              {formatChange(token.priceChange7d)} (7d)
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {token.description && (
        <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-2">
          {token.description}
        </p>
      )}
    </div>
  );
}
