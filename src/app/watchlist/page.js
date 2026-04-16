'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { Star, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist, isClient } = useWatchlist();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
            <Star className="text-yellow-500" size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Your Watchlist</h1>
            <p className="text-slate-400 mt-1">Quickly re-analyze your tracked tokens</p>
          </div>
        </div>

        {!isClient ? (
          <div className="text-center py-20 animate-pulse text-slate-500">Loading your watchlist...</div>
        ) : watchlist.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center">
            <Star size={48} className="text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Watchlist is empty</h3>
            <p className="text-slate-400 mb-6 max-w-sm">
              Search for tokens and click the star icon to save them to your watchlist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold hover:bg-primary/25 transition-all duration-150"
            >
              <TrendingUp size={16} />
              Explore Trending
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {watchlist.map((token) => (
              <div key={token.id} className="glass-card p-5 group flex flex-col hover:border-primary/30 transition-all duration-200 relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWatchlist(token);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-xl text-yellow-500 hover:bg-yellow-500/10 transition-colors z-10"
                  aria-label="Remove from Watchlist"
                >
                  <Star size={16} fill="currentColor" />
                </button>
                <Link href={`/token/${token.id}`} className="flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    {token.image ? (
                      <img src={token.image} alt={token.name} width={40} height={40} className="rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary-light">{token.symbol?.[0]}</span>
                      </div>
                    )}
                    <div className="min-w-0 pr-8">
                      <h3 className="font-bold text-slate-200 truncate">{token.name}</h3>
                      <p className="text-xs text-slate-500 bg-bg-elevated inline-block px-1.5 py-0.5 rounded uppercase mt-0.5">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm pt-4 border-t border-bg-border/50">
                    <span className="text-primary-light opacity-80 group-hover:opacity-100 flex items-center gap-1">
                      Analyze <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="border-t border-bg-border py-6 text-center text-xs text-slate-600">
        AI Crypto Research Copilot
      </footer>
    </div>
  );
}
