import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadGptScript, resetScriptLoader, GPT_SCRIPT_ID } from '../src/utils/scriptLoader';

describe('scriptLoader', () => {
  beforeEach(() => {
    const existing = document.getElementById(GPT_SCRIPT_ID);
    if (existing) existing.remove();
    resetScriptLoader();
  });

  it('injects a script tag with correct src', async () => {
    const loadPromise = loadGptScript();
    const script = document.getElementById(GPT_SCRIPT_ID) as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script?.src).toContain('securepubads.g.doubleclick.net');
    expect(script?.async).toBe(true);

    script?.onload?.(new Event('load'));
    await loadPromise;
  });

  it('returns same promise on subsequent calls', async () => {
    const p1 = loadGptScript();
    const p2 = loadGptScript();
    expect(p1).toBe(p2);

    const script = document.getElementById(GPT_SCRIPT_ID) as HTMLScriptElement;
    script?.onload?.(new Event('load'));
    await p1;
  });

  it('resolves if script already exists', async () => {
    const script = document.createElement('script');
    script.id = GPT_SCRIPT_ID;
    document.head.appendChild(script);

    const promise = loadGptScript();
    await expect(promise).resolves.toBeUndefined();
  });

  it('rejects on script load error', async () => {
    const promise = loadGptScript();
    const script = document.getElementById(GPT_SCRIPT_ID) as HTMLScriptElement;
    script?.onerror?.(new Event('error'));
    await expect(promise).rejects.toThrow('Failed to load GPT script');
  });
});
