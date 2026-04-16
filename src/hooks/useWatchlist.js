import { useState, useEffect, useCallback } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = JSON.parse(localStorage.getItem('cryptoWatchlist') || '[]');
      setWatchlist(stored);
    } catch {
      setWatchlist([]);
    }
  }, []);

  const toggleWatchlist = useCallback((token) => {
    try {
      const prev = JSON.parse(localStorage.getItem('cryptoWatchlist') || '[]');
      let next;
      if (prev.some((t) => t.id === token.id)) {
        next = prev.filter((t) => t.id !== token.id);
      } else {
        const minimalToken = {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          image: token.image?.thumb || token.thumb || null,
        };
        next = [minimalToken, ...prev];
      }
      localStorage.setItem('cryptoWatchlist', JSON.stringify(next));
      setWatchlist(next);
    } catch { }
  }, []);

  const isInWatchlist = useCallback((tokenId) => {
    return watchlist.some((t) => t.id === tokenId);
  }, [watchlist]);

  return { watchlist, toggleWatchlist, isInWatchlist, isClient };
}
