'use client';
// ── Signal Card ────────────────────────────────────────────────────
// Displays risk score, signal labels, and metrics for a token.

import { clsx } from 'clsx';
import { ShieldAlert, ShieldCheck, ShieldQuestion, Activity, Droplets, Users } from 'lucide-react';

/**
 * Get risk color config based on score.
 * Green 0–30, Yellow 30–60, Red 60+
 */
function getRiskConfig(score) {
  if (score <= 30) {
    return {
      label: 'Low Risk',
      color: '#10b981',
      textClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/30',
      glowClass: 'shadow-emerald-500/20',
      Icon: ShieldCheck,
    };
  }
  if (score <= 60) {
    return {
      label: 'Medium Risk',
      color: '#f59e0b',
      textClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/30',
      glowClass: 'shadow-amber-500/20',
      Icon: ShieldQuestion,
    };
  }
  return {
    label: 'High Risk',
    color: '#ef4444',
    textClass: 'text-red-400',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30',
    glowClass: 'shadow-red-500/20',
    Icon: ShieldAlert,
  };
}

export default function SignalCard({ result, tokenName, tokenSymbol, tokenImage }) {
  if (!result) return null;

  const { riskScore, signals, metrics } = result;
  const risk = getRiskConfig(riskScore);
  const RiskIcon = risk.Icon;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Token Header ─────────────────────────────────────────── */}
      {tokenName && (
        <div className="flex items-center gap-3 mb-2">
          {tokenImage && (
            <img
              src={tokenImage}
              alt={tokenName}
              className="w-10 h-10 rounded-xl border border-bg-border"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-100">{tokenName}</h2>
            {tokenSymbol && (
              <span className="text-sm text-slate-500 font-mono">{tokenSymbol}</span>
            )}
          </div>
        </div>
      )}

      {/* ── Risk Score Hero ──────────────────────────────────────── */}
      <div
        className={clsx(
          'glass-card p-6 flex items-center gap-6 border',
          risk.borderClass,
          `shadow-lg ${risk.glowClass}`
        )}
      >
        {/* Big score ring */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-bg-border"
            />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={risk.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(riskScore / 100) * 264} 264`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={clsx('text-2xl font-extrabold', risk.textClass)}>
              {riskScore}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Risk</span>
          </div>
        </div>

        {/* Risk info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <RiskIcon size={18} className={risk.textClass} />
            <span className={clsx('text-lg font-bold', risk.textClass)}>{risk.label}</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {riskScore <= 30
              ? 'This token shows healthy fundamentals based on volume, liquidity, and distribution metrics.'
              : riskScore <= 60
                ? 'Some risk indicators detected. Review the signals below for details.'
                : 'Multiple high-risk factors detected. Exercise extreme caution.'}
          </p>
        </div>
      </div>

      {/* ── Signal Labels ────────────────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Activity size={14} className="text-primary-light" />
          Detected Signals
        </h3>
        <div className="space-y-2">
          {signals.map((signal, i) => (
            <div
              key={i}
              className="flex items-start gap-2 px-3 py-2 rounded-lg bg-bg-elevated/60 border border-bg-border/50 text-sm text-slate-300 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <span className="text-base leading-none mt-0.5">{signal.slice(0, 2)}</span>
              <span>{signal.slice(2).trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Metrics Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Liquidity */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
              <Droplets size={14} className="text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Liquidity Ratio</span>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {metrics.liquidityRatio.toFixed(4)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.liquidityRatio < 0.02
              ? 'Very low'
              : metrics.liquidityRatio < 0.1
                ? 'Moderate'
                : 'Healthy'}
          </div>
        </div>

        {/* Volume / MCap */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/25 flex items-center justify-center">
              <Activity size={14} className="text-violet-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Vol / MCap</span>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {(metrics.volumeToMarketCap * 100).toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.volumeToMarketCap > 0.5
              ? 'Very high'
              : metrics.volumeToMarketCap > 0.1
                ? 'Active'
                : metrics.volumeToMarketCap > 0.05
                  ? 'Normal'
                  : 'Low'}
          </div>
        </div>

        {/* Whale % */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
              <Users size={14} className="text-cyan-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Whale %</span>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {metrics.whaleConcentration !== null
              ? `${metrics.whaleConcentration.toFixed(1)}%`
              : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.whaleConcentration !== null
              ? metrics.whaleConcentration > 50
                ? 'High concentration'
                : metrics.whaleConcentration >= 30
                  ? 'Moderate'
                  : 'Healthy'
              : 'Data unavailable'}
          </div>
        </div>
      </div>
    </div>
  );
}
