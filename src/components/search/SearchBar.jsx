'use client';
// ── Search Bar with Autocomplete ───────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth, useClerk } from '@clerk/nextjs';
import { isContractAddress } from '@/lib/utils';

const MAX_HISTORY = 8;

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({ autoFocus = false, defaultValue = '' }) {
  const router = useRouter();
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      setHistory(stored);
    } catch { }
  }, []);

  // Fetch autocomplete results
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    if (isContractAddress(debouncedQuery)) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setOpen(true);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const saveToHistory = useCallback((item) => {
    try {
      const prev = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const next = [item, ...prev.filter((h) => h.id !== item.id)].slice(0, MAX_HISTORY);
      localStorage.setItem('searchHistory', JSON.stringify(next));
      setHistory(next);
    } catch { }
  }, []);

  const navigate = useCallback((token) => {
    saveToHistory(token);
    setOpen(false);
    setQuery('');
    router.push(`/token/${token.id}`);
  }, [router, saveToHistory]);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    if (!userId) {
      openSignIn();
      return;
    }
    const trimmed = query.trim();
    if (!trimmed) return;

    if (isContractAddress(trimmed)) {
      saveToHistory({ id: trimmed, name: trimmed, symbol: 'CONTRACT' });
      router.push(`/token/${encodeURIComponent(trimmed)}`);
      setQuery('');
      setOpen(false);
      return;
    }

    if (results.length > 0) {
      navigate(results[0]);
    }
  }, [query, results, navigate, router, saveToHistory]);

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setHistory([]);
  };

  const showDropdown = open && focused && (results.length > 0 || (query.length === 0 && history.length > 0));

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center rounded-2xl border transition-all duration-200 ${focused ? 'border-primary/60 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]' : 'border-bg-border'} bg-bg-surface`}>
          <Search size={18} className={`absolute left-4 transition-colors duration-200 ${focused ? 'text-primary-light' : 'text-slate-500'}`} />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => { 
              if (!userId) {
                openSignIn();
                return;
              }
              setQuery(e.target.value); 
              setOpen(true); 
            }}
            onFocus={() => { 
              if (!userId) {
                inputRef.current?.blur();
                openSignIn();
                return;
              }
              setFocused(true); 
              setOpen(true); 
            }}
            onBlur={() => setFocused(false)}
            placeholder="Search token name or paste contract address…"
            className="w-full bg-transparent pl-11 pr-12 py-4 text-slate-100 placeholder-slate-500 outline-none text-base"
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="absolute right-4 flex items-center gap-2">
            {loading && <Loader2 size={16} className="text-primary-light animate-spin" />}
            {query && !loading && (
              <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                className="text-slate-500 hover:text-slate-300 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-bg-surface border border-bg-border rounded-2xl overflow-hidden shadow-2xl z-50 animate-scale-in">

          {/* Recent searches */}
          {query.length === 0 && history.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-bg-border">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent</span>
                <button onClick={clearHistory} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Clear</button>
              </div>
              {history.map((item) => (
                <button key={item.id} onMouseDown={() => navigate(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors text-left">
                  <Clock size={14} className="text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item.name}</span>
                  {item.symbol && <span className="text-xs text-slate-500 ml-auto">{item.symbol}</span>}
                </button>
              ))}
            </div>
          )}

          {/* Search results */}
          {results.length > 0 && (
            <div>
              {query.length > 0 && (
                <div className="px-4 py-2.5 border-b border-bg-border">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Results</span>
                </div>
              )}
              {results.map((token, i) => (
                <button key={token.id} onMouseDown={() => navigate(token)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors text-left group">
                  {token.thumb ? (
                    <img src={token.thumb} alt={token.name} width={28} height={28} className="rounded-full flex-shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={12} className="text-primary-light" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">{token.name}</div>
                    <div className="text-xs text-slate-500">{token.symbol}</div>
                  </div>
                  {token.marketCapRank && (
                    <span className="text-xs text-slate-600 flex-shrink-0">#{token.marketCapRank}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
