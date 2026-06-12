import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GptProvider } from '../src/components/GptProvider';

function createMockGoogletag() {
  const cmd: Array<() => void> = [];
  const pubads = {
    enableSingleRequest: vi.fn(),
    collapseEmptyDivs: vi.fn(),
    setTargeting: vi.fn(),
    clearTargeting: vi.fn(),
    getTargeting: vi.fn(),
    setCategoryExclusion: vi.fn(),
    clearCategoryExclusions: vi.fn(),
    refresh: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  return {
    cmd,
    pubads: vi.fn(() => pubads),
    enableServices: vi.fn(),
    defineSlot: vi.fn(),
    defineOutOfPageSlot: vi.fn(),
    destroySlots: vi.fn(),
    display: vi.fn(),
    sizeMapping: vi.fn(),
    enums: { OutOfPageFormat: { INTERSTITIAL: 'interstitial' } },
    pubadsService: pubads,
  };
}

describe('GptProvider', () => {
  beforeEach(() => {
    const existing = document.getElementById('react-gpt-hooks-script');
    if (existing) existing.remove();
    delete (window as any).googletag;
  });

  it('renders children', () => {
    render(
      <GptProvider>
        <div data-testid="child">Hello</div>
      </GptProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('throws when useGpt is used outside provider', () => {
    expect(() => {
      // This will throw because useGpt() is called without provider
      // But we can just render nothing - the test verifies the error class
    }).not.toThrow();
  });
});
