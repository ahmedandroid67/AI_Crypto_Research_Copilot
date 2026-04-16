'use client';
// ── Header ─────────────────────────────────────────────────────────
import Link from 'next/link';
import { Cpu, TrendingUp, Star, GitCompare } from 'lucide-react';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';

export default function Header() {
  const { isLoaded, userId } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-xl border-b border-bg-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:border-primary/70 transition-all duration-200">
              <Cpu size={16} className="text-primary-light" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-200" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-slate-100">AI Crypto</span>
            <span className="text-xs font-medium text-primary-light">Research Copilot</span>
          </div>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            <Link
              href="/compare"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-bg-elevated transition-all duration-150"
            >
              <GitCompare size={14} />
              Compare
            </Link>
            <Link
              href="/watchlist"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-bg-elevated transition-all duration-150"
            >
              <Star size={14} />
              Watchlist
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-bg-elevated transition-all duration-150"
            >
              <TrendingUp size={14} />
              Trending
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-primary-light hover:text-primary transition-all duration-150 font-medium"
            >
              Pro
            </Link>
          </nav>
          
          <div className="h-6 w-px bg-slate-700/50"></div>
          
          <div className="flex items-center">
            {isLoaded && !userId && (
              <SignInButton mode="modal">
                <button className="text-sm font-medium bg-primary/10 text-primary-light hover:bg-primary/20 px-4 py-1.5 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
            {isLoaded && userId && (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors"
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
