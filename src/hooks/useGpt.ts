'use client';

import { createContext, useContext } from 'react';
import type { GptContextValue } from '../types';

const GptContext = createContext<GptContextValue | null>(null);

export function useGpt(): GptContextValue {
  const context = useContext(GptContext);
  if (!context) {
    throw new Error('useGpt must be used within a GptProvider');
  }
  return context;
}

export { GptContext };
