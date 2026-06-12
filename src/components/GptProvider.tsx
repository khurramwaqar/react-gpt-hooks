'use client';

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { GptContext } from '../hooks/useGpt';
import { loadGptScript } from '../utils/scriptLoader';
import type { Googletag, GptProviderOptions, GptContextValue } from '../types';

interface GptProviderProps {
  children: ReactNode;
  options?: GptProviderOptions;
}

export function GptProvider({ children, options = {} }: GptProviderProps) {
  const [googletag, setGoogletag] = useState<Googletag | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadGptScript()
      .then(() => {
        if (cancelled) return;

        const gpt = (window as unknown as { googletag?: Googletag }).googletag;
        if (!gpt) return;

        gpt.cmd.push(() => {
          if (cancelled) return;

          const pubads = gpt.pubads();

          if (options.singleRequest !== false) {
            pubads.enableSingleRequest();
          }

          if (options.collapseEmptyDivs) {
            pubads.collapseEmptyDivs(true);
          }

          gpt.enableServices();

          setGoogletag(gpt);
          setIsLoaded(true);
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [options.singleRequest, options.collapseEmptyDivs, options.enableLazyLoad]);

  const contextValue = useMemo<GptContextValue>(
    () => ({ googletag, isLoaded, options }),
    [googletag, isLoaded, options]
  );

  return (
    <GptContext.Provider value={contextValue}>
      {children}
    </GptContext.Provider>
  );
}
