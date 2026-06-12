# react-gpt-hooks

Modern React hooks & components for [Google Publisher Tag (GPT)](https://developers.google.com/publisher-tag) ads. TypeScript-first, zero dependencies, SSR/Next.js ready.

## Installation

```bash
npm install react-gpt-hooks
```

Peer dependencies: `react >= 18`, `react-dom >= 18`.

## Quick Start

```tsx
import { GptProvider, GptBanner, AD_SIZES } from 'react-gpt-hooks';

function RootLayout({ children }) {
  return (
    <GptProvider
      options={{
        singleRequest: true,
        collapseEmptyDivs: true,
      }}
    >
      {children}
    </GptProvider>
  );
}

function HomePage() {
  return (
    <GptBanner
      adUnitPath="/67551462/aryzap-home"
      sizes={AD_SIZES.LEADERBOARD}
      slotId="my-leaderboard"
    />
  );
}
```

## API

### GptProvider

Context provider that loads the GPT script once, initializes `googletag`, configures single request mode, and provides config to all children.

### GptBanner

Banner/display ad component with slot lifecycle management, event callbacks, lazy loading, and collapse empty div support.

### GptInterstitial

Full-screen interstitial ad with visibility control, auto-close, and loading/error states.

### useGptSlot

Low-level hook for custom ad slot implementations.

### useGptEvent

Hook to listen to GPT events (`slotRenderEnded`, `impressionViewable`, `slotRequested`, etc.) filtered by slot ID.

### AD_SIZES

Standard ad size presets: `LEADERBOARD`, `MEDIUM_RECTANGLE`, `MOBILE_BANNER`, `SKYSCRAPER`, `BILLBOARD`, `INTERSTITIAL`, and more.

## Examples

Check the [examples](./examples) directory for Vite and Next.js App Router projects.

## License

MIT
