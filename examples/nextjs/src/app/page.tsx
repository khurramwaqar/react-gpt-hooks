'use client';

import { GptBanner, AD_SIZES } from 'react-gpt-hooks';

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>react-gpt-hooks Next.js Example</h1>

      <h2>Leaderboard</h2>
      <GptBanner
        adUnitPath="/6499/example/banner"
        sizes={AD_SIZES.LEADERBOARD}
        slotId="nextjs-leaderboard"
        collapseEmptyDiv
      />

      <h2>Medium Rectangle</h2>
      <GptBanner
        adUnitPath="/6499/example/banner"
        sizes={AD_SIZES.MEDIUM_RECTANGLE}
        slotId="nextjs-med-rect"
      />
    </div>
  );
}
