'use client';
// ── Trending Tokens List ───────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { formatChange, changeColor, formatPrice } from '@/lib/utils';
import { TrendingSkeleton } from '@/components/ui/Skeleton';

export default function TrendingList() {
  const router = useRouter();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/trending')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTokens(data.tokens || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Flame size={15} className="text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-200">Trending Now</h2>
        <span className="text-xs text-slate-600 ml-1">on CoinGecko</span>
      </div>

      {loading && <TrendingSkeleton />}

      {error && (
        <div className="text-sm text-slate-500 py-4">Unable to load trending tokens.</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tokens.map((token, i) => {
            const isUp = (token.priceChange24h || 0) >= 0;
            return (
              <button
                key={token.id}
                onClick={() => router.push(`/token/${token.id}`)}
                className="glass-card p-4 text-left hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  {token.thumb ? (
                    <img src={token.thumb} alt={token.name} width={28} height={28} className="rounded-full flex-shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-light">{token.symbol?.[0]}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-300 truncate group-hover:text-white transition-colors">
                      {token.symbol}
                    </div>
                    {token.marketCapRank && (
                      <div className="text-xs text-slate-600">#{token.marketCapRank}</div>
                    )}
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-400 truncate mb-1">
                  {token.name}
                </div>
                {token.priceChange24h !== null && (
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${changeColor(token.priceChange24h)}`}>
                    {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {formatChange(token.priceChange24h)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
