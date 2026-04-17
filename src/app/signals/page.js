'use client';
// ── Signals Page ──────────────────────────────────────────────────
// Deterministic crypto signal analysis — no AI, pure data + math.

import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import SignalCard from '@/components/signals/SignalCard';
import { Search, Radio, Loader2, AlertCircle, Cpu, Sparkles, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const QUICK_TOKENS = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'solana', label: 'Solana' },
  { id: 'dogecoin', label: 'Dogecoin' },
  { id: 'chainlink', label: 'Chainlink' },
  { id: 'ripple', label: 'XRP' },
];

export default function SignalsPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  const analyzeToken = useCallback(async (tokenId) => {
    if (!tokenId.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setTokenInfo(null);

    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: tokenId.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze token');
      }

      setTokenInfo(data.token);
      setResult(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeToken(query);
  };

  const handleQuickToken = (id) => {
    setQuery(id);
    analyzeToken(id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ── Hero Section ──────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-6">
            <Radio size={12} className="animate-pulse" />
            Real-Time Signal Analysis
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-4 leading-tight text-balance">
            Crypto{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Signal Scanner
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed text-balance">
            Deterministic risk analysis using real market data — liquidity, volume ratios, and whale concentration. No AI, pure math.
          </p>

          {/* ── Search Form ────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-4">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative flex items-center gap-2 bg-bg-surface border border-bg-border rounded-2xl px-4 py-3 group-focus-within:border-emerald-500/40 transition-colors duration-200">
                <Search size={18} className="text-slate-500 flex-shrink-0" />
                <input
                  id="signal-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter token name or CoinGecko ID (e.g. bitcoin, solana)..."
                  className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 outline-none"
                  disabled={loading}
                />
                <button
                  id="signal-search-button"
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  Analyze
                </button>
              </div>
            </div>
          </form>

          {/* Quick tokens */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-600">Quick:</span>
            {QUICK_TOKENS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleQuickToken(t.id)}
                disabled={loading}
                className="text-xs px-2.5 py-1 rounded-full bg-bg-elevated border border-bg-border text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 disabled:opacity-40 transition-all duration-150"
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Results Section ──────────────────────────────────── */}
        <section className="max-w-2xl mx-auto px-4 pb-20">
          {/* Loading */}
          {loading && (
            <div className="glass-card p-10 text-center animate-fade-in">
              <Loader2 size={32} className="text-emerald-400 animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-400">Fetching market data & computing signals…</p>
              <div className="flex items-center justify-center gap-6 mt-6">
                {[
                  { icon: BarChart3, label: 'Volume' },
                  { icon: Shield, label: 'Risk' },
                  { icon: TrendingUp, label: 'Liquidity' },
                ].map(({ icon: Icon, label }, i) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-bg-border flex items-center justify-center">
                      <Icon size={16} className="text-slate-500" />
                    </div>
                    <span className="text-[10px] text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="glass-card p-6 border-red-500/30 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-400 mb-1">Analysis Failed</h3>
                  <p className="text-sm text-slate-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <SignalCard
              result={result}
              tokenName={tokenInfo?.name}
              tokenSymbol={tokenInfo?.symbol}
              tokenImage={tokenInfo?.image}
            />
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-bg-border flex items-center justify-center mx-auto mb-4">
                <Radio size={24} className="text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-400 mb-1">No signals yet</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Enter a token name above to scan for risk signals, liquidity metrics, and whale concentration.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-bg-border py-6 text-center text-xs text-slate-600">
        <div className="flex items-center justify-center gap-1.5">
          <Cpu size={12} />
          Signal Scanner · Data from{' '}
          <a
            href="https://coingecko.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-emerald-400 transition-colors"
          >
            CoinGecko
          </a>
          {' '}& Etherscan · Not financial advice
        </div>
      </footer>
    </div>
  );
}
