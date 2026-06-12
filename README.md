![react-gpt-hooks](google-ads.webp)

# react-gpt-hooks

Modern React hooks & components for [Google Publisher Tag (GPT)](https://developers.google.com/publisher-tag) ads. TypeScript-first, zero dependencies, fully compatible with SSR and Next.js App Router.

---

## Features

- **Zero dependencies** — only peer deps: `react >= 18`, `react-dom >= 18`
- **TypeScript-first** — full type definitions shipped with the package
- **SSR / Next.js ready** — all components use `'use client'` boundary with `suppressHydrationWarning`
- **Lazy loading** — built-in Intersection Observer support for viewport-based ad loading
- **Single Request Mode** — configurable via `GptProvider`
- **Event system** — hooks for `slotRenderEnded`, `impressionViewable`, `slotRequested`, etc.
- **Ad size presets** — `AD_SIZES` constant with 10 standard size groups

---

## Installation

```bash
npm install react-gpt-hooks
```

Peer dependencies (must be installed in your project):

```bash
npm install react react-dom
```

---

## Quick Start

Wrap your app with `GptProvider`, then drop `GptBanner` anywhere.

```tsx
import { GptProvider, GptBanner, AD_SIZES } from 'react-gpt-hooks';

function Layout({ children }) {
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
    <>
      <h1>My Page</h1>
      <GptBanner
        adUnitPath="/67551462/aryzap-home"
        sizes={AD_SIZES.LEADERBOARD}
        slotId="leaderboard-1"
      />
    </>
  );
}
```

---

## API Reference

### `GptProvider`

Root context provider. Loads the GPT script once, initializes `googletag`, configures global settings, and provides the GPT instance to all children.

```tsx
import { GptProvider } from 'react-gpt-hooks';

<GptProvider
  options={{
    singleRequest: true,       // enable Single Request Mode (default: true)
    collapseEmptyDivs: true,   // collapse div when ad is empty
    enableLazyLoad: true,      // enable default lazy loading
    adUnitBase: '/67551462',   // optional base ad unit path
  }}
>
  {children}
</GptProvider>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `GptProviderOptions` | `{}` | GPT configuration |

---

### `GptBanner`

Banner/display ad component. Handles slot definition, rendering, event callbacks, lazy loading, and cleanup.

```tsx
import { GptBanner, AD_SIZES } from 'react-gpt-hooks';

<GptBanner
  adUnitPath="/67551462/aryzap-home"
  sizes={AD_SIZES.MEDIUM_RECTANGLE}
  slotId="my-slot"
  collapseEmptyDiv
  lazyLoad={{ rootMargin: '200px' }}
  targeting={{ key: 'value' }}
  onRenderEnded={(event) => console.log('rendered', event)}
  onImpressionViewable={(event) => console.log('viewable', event)}
  onSlotRequested={(event) => console.log('requested', event)}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `adUnitPath` | `string` | required | GPT ad unit path |
| `sizes` | `[number,number][]` | required | Array of `[width, height]` sizes |
| `slotId` | `string` | auto-generated | DOM element ID and GPT slot identifier |
| `collapseEmptyDiv` | `boolean` | `false` | Collapse div if no ad returned |
| `lazyLoad` | `{ rootMargin?, threshold? }` | `undefined` | Intersection Observer options for lazy loading |
| `targeting` | `Record<string, string \| string[]>` | `undefined` | Custom key-value targeting |
| `onRenderEnded` | `(event) => void` | `undefined` | Called when slot render completes |
| `onImpressionViewable` | `(event) => void` | `undefined` | Called when impression becomes viewable |
| `onSlotRequested` | `(event) => void` | `undefined` | Called when ad request is made |

---

### `GptInterstitial`

Full-screen interstitial ad overlay with loading/error states, auto-close timer, and close button.

```tsx
import { useState } from 'react';
import { GptInterstitial } from 'react-gpt-hooks';

function MyPage() {
  const [showAd, setShowAd] = useState(false);

  return (
    <div>
      <button onClick={() => setShowAd(true)}>Show Ad</button>

      <GptInterstitial
        adUnitPath="/67551462/aryzap-interstitial"
        sizes={[[320, 480], [768, 1024], [970, 250]]}
        isVisible={showAd}
        onClose={() => setShowAd(false)}
        onRenderEnded={(event) => console.log('rendered')}
        onRequestFailed={(event) => console.log('failed or empty')}
        autoCloseDuration={30000}
      />
    </div>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `adUnitPath` | `string` | required | GPT ad unit path |
| `sizes` | `[number,number][]` | required | Array of ad sizes |
| `isVisible` | `boolean` | required | Show/hide the interstitial |
| `onClose` | `() => void` | required | Called when ad should close |
| `onRenderEnded` | `(event) => void` | `undefined` | Called on successful render |
| `onRequestFailed` | `(event) => void` | `undefined` | Called when ad returns empty or fails |
| `autoCloseDuration` | `number` | `30000` | Auto-close after N milliseconds (0 to disable) |

**Behavior:**
- When `isVisible` becomes `true`, the slot is defined and GPT renders the ad
- If the ad renders empty, `onRequestFailed` fires and the overlay auto-closes
- On successful render, it auto-closes after `autoCloseDuration` ms (default 30s)
- When `isVisible` becomes `false`, the slot is destroyed
- Loading and error states are shown automatically

---

### `useGptSlot`

Low-level hook for building custom ad components. Gives you full control over the slot lifecycle.

```tsx
import { useGptSlot, AD_SIZES } from 'react-gpt-hooks';

function CustomAd() {
  const { containerRef, slotId, isLoaded, isEmpty, refresh, destroy } = useGptSlot({
    adUnitPath: '/67551462/aryzap-home',
    sizes: AD_SIZES.LEADERBOARD,
    slotId: 'custom-ad-1',
    targeting: { position: 'sidebar' },
  });

  return (
    <div>
      <div ref={containerRef} id={slotId} />
      {isEmpty && <p>Ad not available</p>}
      {isLoaded && <p>Ad loaded</p>}
      <button onClick={refresh}>Refresh</button>
      <button onClick={destroy}>Destroy</button>
    </div>
  );
}
```

**Hook options (`UseGptSlotOptions`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `adUnitPath` | `string` | required | GPT ad unit path |
| `sizes` | `[number,number][]` | required | Ad sizes |
| `slotId` | `string` | auto-generated | Slot identifier |
| `targeting` | `Record<string, string \| string[]>` | `undefined` | Key-value targeting |
| `lazyLoad` | `{ rootMargin?, threshold? }` | `undefined` | Lazy load options |
| `collapseEmptyDiv` | `boolean` | `false` | Collapse empty div |

**Returns (`UseGptSlotResult`):**

| Return | Type | Description |
|--------|------|-------------|
| `containerRef` | `RefObject` | Ref to attach to the container div |
| `slotId` | `string` | The slot ID (auto-generated or provided) |
| `isLoaded` | `boolean` | Whether the slot has rendered |
| `isEmpty` | `boolean` | Whether the slot returned empty |
| `refresh` | `() => void` | Refresh the ad slot |
| `destroy` | `() => void` | Destroy the slot |

---

### `useGptEvent`

Hook to listen to GPT events globally or filtered by a specific slot ID.

```tsx
import { useGptEvent } from 'react-gpt-hooks';

// Listen to all slotRenderEnded events
useGptEvent('slotRenderEnded', (event) => {
  console.log('Slot rendered:', event.slot.getSlotElementId());
});

// Listen only to events for a specific slot
useGptEvent('impressionViewable', (event) => {
  console.log('Impression viewable for slot', event.slot.getSlotElementId());
}, 'my-slot-id');
```

**Available event types:**

- `impressionViewable`
- `slotRenderEnded`
- `slotVisibilityChanged`
- `slotOnload`
- `slotRequested`
- `slotResponseReceived`
- `slotResponseRendered`

---

### `AD_SIZES`

Pre-defined standard ad size groups.

```tsx
import { AD_SIZES } from 'react-gpt-hooks';

AD_SIZES.LEADERBOARD       // [[728, 90], [970, 90]]
AD_SIZES.LEADERBOARD_XL    // [[728, 90], [970, 90], [970, 250]]
AD_SIZES.MEDIUM_RECTANGLE  // [[300, 250], [336, 280]]
AD_SIZES.WIDE_SKYSCRAPER   // [[160, 600]]
AD_SIZES.SKYSCRAPER        // [[120, 600], [160, 600], [300, 600]]
AD_SIZES.MOBILE_BANNER     // [[320, 50], [320, 100]]
AD_SIZES.BANNER            // [[468, 60]]
AD_SIZES.LARGE_BANNER      // [[970, 250]]
AD_SIZES.BILLBOARD         // [[970, 250], [980, 120], [930, 180]]
AD_SIZES.INTERSTITIAL      // [[320, 480], [768, 1024], [970, 250]]
```

---

## Next.js App Router Support

This package is fully compatible with Next.js App Router. All components use the `'use client'` directive and `suppressHydrationWarning` to prevent hydration mismatches.

### Layout — `app/layout.tsx`

```tsx
import { GptProvider } from 'react-gpt-hooks';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GptProvider
          options={{
            singleRequest: true,
            collapseEmptyDivs: true,
          }}
        >
          {children}
        </GptProvider>
      </body>
    </html>
  );
}
```

> **Note:** `GptProvider` is a client component but can be imported directly in a Server Component layout — the `'use client'` directive handles this automatically.

### Page — `app/page.tsx`

```tsx
'use client';

import { GptBanner, AD_SIZES } from 'react-gpt-hooks';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>

      <GptBanner
        adUnitPath="/67551462/aryzap-home"
        sizes={AD_SIZES.LEADERBOARD}
        slotId="nextjs-leaderboard"
        collapseEmptyDiv
      />

      <GptBanner
        adUnitPath="/67551462/aryzap-home"
        sizes={AD_SIZES.MEDIUM_RECTANGLE}
        slotId="nextjs-med-rect"
      />
    </div>
  );
}
```

### How SSR handling works

| Concern | Solution |
|---------|----------|
| Script loading | `'use client'` ensures GPT script only loads in the browser |
| Hydration mismatch | `suppressHydrationWarning` on container divs — GPT adds children on the client, suppressing React warnings |
| Server render | Components return `null` when `typeof window === 'undefined'` |
| Type safety | Full TypeScript declarations included |

---

## TypeScript

All types are exported for use in your projects:

```tsx
import type {
  Googletag,
  PubAdsService,
  Slot,
  AdSize,
  SlotEvent,
  GptEventType,
  GptProviderOptions,
  GptBannerProps,
  GptInterstitialProps,
  UseGptSlotOptions,
  UseGptSlotResult,
  GptContextValue,
} from 'react-gpt-hooks';
```

---

## Examples

### Basic (Vite)

```bash
cd examples/basic
npm install
npm run dev
```

### Next.js (App Router)

```bash
cd examples/nextjs
npm install
npm run dev
```

---

## Development

```bash
# Build (ESM + CJS + .d.ts)
npm run build

# Type check
npm run typecheck

# Test
npm test

# Watch mode
npm run dev
```

---

## License

MIT
