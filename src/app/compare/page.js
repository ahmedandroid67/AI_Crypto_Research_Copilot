'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/search/SearchBar';
import TokenHeader from '@/components/token/TokenHeader';
import RiskGauge from '@/components/analysis/RiskGauge';
import SummaryCard from '@/components/analysis/SummaryCard';
import VerdictCard from '@/components/analysis/VerdictCard';
import SentimentCard from '@/components/analysis/SentimentCard';
import TokenomicsCard from '@/components/analysis/TokenomicsCard';
import { AnalysisSkeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, GitCompare, RefreshCw, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

function CompareSlot({ title, onSelect, selectedTokenId, onClear }) {
  const [token, setToken] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If a prop is passed, we fetch it immediately
  useEffect(() => {
    if (!selectedTokenId) {
      setToken(null);
      setAnalysis(null);
      setError(null);
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tRes = await fetch(`/api/token/${encodeURIComponent(selectedTokenId)}`);
        const tData = await tRes.json();
        if (!tRes.ok) throw new Error(tData.error || 'Failed to load token');
        
        if (isMounted) setToken(tData.token);

        const aRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenData: tData.token }),
        });
        const aData = await aRes.json();
        if (!aRes.ok) throw new Error(aData.error || 'Analysis failed');
        
        if (isMounted) setAnalysis(aData.analysis);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [selectedTokenId]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-200">{title}</h2>
        {selectedTokenId && (
          <button onClick={onClear} className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded-md bg-bg-elevated">
            Clear
          </button>
        )}
      </div>

      {!selectedTokenId ? (
        <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-slate-700/50">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <GitCompare className="text-slate-500" />
          </div>
          <p className="text-sm text-slate-400 mb-6 text-center max-w-[200px]">Search for a token to add it to comparison</p>
          <div className="w-full relative z-10" onClick={(e) => {
             // Intercept search inside slot to avoid routing, need to pass it back up
             // Because SearchBar routes on submit, we might have to wrap it and intercept push natively or build a custom comparison search.
             // For simplicity, we just use the global search bar but override routing behavior.
          }}>
             {/* A custom minimal search or just instructions */}
             <div className="text-xs text-slate-500 text-center bg-slate-800 p-3 rounded border border-slate-700">
                Use the search bars at the top to select tokens.
             </div>
          </div>
        </div>
      ) : loading ? (
        <AnalysisSkeleton />
      ) : error ? (
        <div className="glass-card p-8 text-center bg-red-900/10 border-red-900/30">
          <AlertCircle className="mx-auto text-red-500 mb-2" />
          <div className="text-sm text-slate-300">{error}</div>
        </div>
      ) : token && analysis ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          <TokenHeader token={token} />
          <RiskGauge riskScore={analysis.risk_score} />
          <VerdictCard verdict={analysis.verdict} />
          <TokenomicsCard tokenomics={analysis.tokenomics} />
        </div>
      ) : null}
    </div>
  );
}

export default function ComparePage() {
  const router = useRouter();
  const [token1Id, setToken1Id] = useState('');
  const [token2Id, setToken2Id] = useState('');
  const [searchInput1, setSearchInput1] = useState('');
  const [searchInput2, setSearchInput2] = useState('');

  const handleSearchKeyPress = (e, setTokenId) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setTokenId(e.target.value.trim().toLowerCase());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <GitCompare className="text-purple-400" size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Compare Tokens</h1>
              <p className="text-sm text-slate-400 mt-1">Side-by-side AI analysis to help you decide.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="glass-card p-4 flex flex-col gap-2 relative z-50">
             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Asset 1</label>
             <input
                type="text"
                placeholder="Type a coin ID and press Enter (e.g. bitcoin)"
                className="w-full bg-slate-900/50 border border-bg-border rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary/50"
                value={searchInput1}
                onChange={e => setSearchInput1(e.target.value)}
                onKeyDown={e => handleSearchKeyPress(e, setToken1Id)}
             />
          </div>
          <div className="glass-card p-4 flex flex-col gap-2 relative z-40">
             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Asset 2</label>
             <input
                type="text"
                placeholder="Type a coin ID and press Enter (e.g. ethereum)"
                className="w-full bg-slate-900/50 border border-bg-border rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary/50"
                value={searchInput2}
                onChange={e => setSearchInput2(e.target.value)}
                onKeyDown={e => handleSearchKeyPress(e, setToken2Id)}
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          <CompareSlot 
            title="Token A" 
            selectedTokenId={token1Id} 
            onClear={() => { setToken1Id(''); setSearchInput1(''); }} 
          />
          <CompareSlot 
            title="Token B" 
            selectedTokenId={token2Id} 
            onClear={() => { setToken2Id(''); setSearchInput2(''); }} 
          />
        </div>
      </main>
    </div>
  );
}
