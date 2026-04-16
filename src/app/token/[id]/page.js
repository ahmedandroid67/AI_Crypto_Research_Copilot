'use client';
// ── Token Analysis Page ────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, AlertCircle, Brain, Share2, Download, Printer } from 'lucide-react';
import Header from '@/components/layout/Header';
import TokenHeader from '@/components/token/TokenHeader';
import MetricsGrid from '@/components/token/MetricsGrid';
import PriceChart from '@/components/token/PriceChart';
import SummaryCard from '@/components/analysis/SummaryCard';
import RiskGauge from '@/components/analysis/RiskGauge';
import TokenomicsCard from '@/components/analysis/TokenomicsCard';
import SentimentCard from '@/components/analysis/SentimentCard';
import VerdictCard from '@/components/analysis/VerdictCard';
import { AnalysisSkeleton } from '@/components/ui/Skeleton';

function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-card p-10 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={22} className="text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">Analysis Failed</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold hover:bg-primary/25 transition-all duration-150"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

function AnalyzingBanner({ tokenName }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4 animate-glow-pulse">
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
        <Brain size={18} className="text-primary-light animate-pulse" />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-200">
          Analyzing {tokenName}…
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          AI is reviewing tokenomics, market data, and risk factors
        </div>
      </div>
      <div className="ml-auto flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary-light"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function TokenPage() {
  const { id } = useParams();
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Fetch token data
  const fetchToken = useCallback(async () => {
    setTokenLoading(true);
    setTokenError(null);
    try {
      const res = await fetch(`/api/token/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load token');
      setToken(data.token);
    } catch (err) {
      setTokenError(err.message);
    } finally {
      setTokenLoading(false);
    }
  }, [id]);

  // Run AI analysis
  const fetchAnalysis = useCallback(async (tokenData) => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI analysis failed');
      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysisError(err.message);
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
    setAnalysis(null);
    setAnalysisError(null);
  }, [fetchToken]);

  // Auto-trigger analysis once token data is available
  useEffect(() => {
    if (token && !analysis && !analysisLoading && !analysisError) {
      fetchAnalysis(token);
    }
  }, [token, analysis, analysisLoading, analysisError, fetchAnalysis]);

  const handleRetryAnalysis = () => {
    if (token) fetchAnalysis(token);
  };

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }, []);

  const exportJSON = useCallback(() => {
    if (!analysis || !token) return;
    const blob = new Blob([JSON.stringify({ token, analysis }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${token.symbol}-analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [analysis, token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Token Loading Skeleton */}
        {tokenLoading && <AnalysisSkeleton />}

        {/* Token Load Error */}
        {tokenError && !tokenLoading && (
          <ErrorState message={tokenError} onRetry={fetchToken} />
        )}

        {/* Main content */}
        {token && !tokenLoading && (
          <div className="space-y-6">
            {/* Token Header */}
            <TokenHeader token={token} />

            {/* Metrics */}
            <MetricsGrid token={token} />

            {/* Price Chart */}
            <PriceChart tokenId={token.id} />

            {/* AI Analysis section */}
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-secondary" />
                  <h2 className="text-base font-semibold text-slate-300">AI Analysis</h2>
                  {analysis?.cached && (
                    <span className="text-xs text-slate-600 bg-bg-elevated border border-bg-border px-2 py-0.5 rounded-full">
                      Cached
                    </span>
                  )}
                </div>
                {analysis && (
                  <div className="flex items-center gap-2">
                    <button onClick={copyShareLink} className="p-2 rounded-xl bg-bg-elevated text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors" title="Copy Link">
                      <Share2 size={16} />
                    </button>
                    <button onClick={exportJSON} className="p-2 rounded-xl bg-bg-elevated text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors" title="Export JSON">
                      <Download size={16} />
                    </button>
                    <button onClick={() => window.print()} className="p-2 rounded-xl bg-bg-elevated text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors" title="Print/Export PDF">
                      <Printer size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Analyzing banner */}
              {analysisLoading && <AnalyzingBanner tokenName={token.name} />}

              {/* Analysis Error */}
              {analysisError && !analysisLoading && (
                <ErrorState message={analysisError} onRetry={handleRetryAnalysis} />
              )}

              {/* Analysis Results */}
              {analysis && !analysisLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <SummaryCard summary={analysis.summary} />
                  <RiskGauge riskScore={analysis.risk_score} />
                  <TokenomicsCard tokenomics={analysis.tokenomics} />
                  <SentimentCard sentiment={analysis.sentiment} />
                  <VerdictCard verdict={analysis.verdict} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-bg-border py-4 text-center text-xs text-slate-700">
        Not financial advice · Data may be delayed
      </footer>
    </div>
  );
}
