// ── Landing Page ───────────────────────────────────────────────────
import Header from '@/components/layout/Header';
import SearchBar from '@/components/search/SearchBar';
import TrendingList from '@/components/trending/TrendingList';
import { Cpu, Zap, Shield, TrendingUp } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Instant Analysis', desc: 'AI-powered insights in seconds — summary, tokenomics, and verdict.' },
  { icon: Shield, title: 'Risk Scoring', desc: 'Objective 0–100 risk score with specific risk factors identified.' },
  { icon: TrendingUp, title: 'Market Data', desc: 'Live data from CoinGecko — price, volume, supply, and chart history.' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary-light text-xs font-semibold mb-6">
            <Cpu size={12} />
            AI-Powered Crypto Research
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-4 leading-tight text-balance">
            Research Any Crypto Token{' '}
            <span className="gradient-text">in Seconds</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed text-balance">
            Enter a token name or contract address and get instant AI analysis — risk score, tokenomics, sentiment, and a clear verdict.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <SearchBar autoFocus />
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-600">Try:</span>
            {['bitcoin', 'ethereum', 'solana', 'chainlink'].map((t) => (
              <a
                key={t}
                href={`/token/${t}`}
                className="text-xs px-2.5 py-1 rounded-full bg-bg-elevated border border-bg-border text-slate-500 hover:text-primary-light hover:border-primary/30 transition-all duration-150"
              >
                {t}
              </a>
            ))}
          </div>
        </section>

        {/* Feature highlights */}
        <section className="max-w-3xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-5 text-center hover:border-primary/30 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-primary-light" />
                </div>
                <div className="font-semibold text-slate-200 text-sm mb-1">{title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <TrendingList />
        </section>
      </main>

      <footer className="border-t border-bg-border py-6 text-center text-xs text-slate-600">
        <div className="flex items-center justify-center gap-1.5">
          <Cpu size={12} />
          AI Crypto Research Copilot · Data from{' '}
          <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer"
            className="text-slate-500 hover:text-primary-light transition-colors">
            CoinGecko
          </a>
          · Not financial advice
        </div>
      </footer>
    </div>
  );
}
