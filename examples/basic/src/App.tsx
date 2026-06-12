import { useState } from 'react';
import { GptProvider, GptBanner, GptInterstitial } from 'react-gpt-hooks';

export default function App() {
  const [showInterstitial, setShowInterstitial] = useState(false);

  return (
    <GptProvider
      options={{
        singleRequest: true,
        collapseEmptyDivs: true,
      }}
    >
      <div style={{ padding: 20 }}>
        <h1>react-gpt-hooks Basic Example</h1>

        <h2>Leaderboard</h2>
        <GptBanner
          adUnitPath="/67551462/aryzap-home"
          sizes={[[728, 90], [970, 250]]}
          slotId="leaderboard-1"
        />

        <h2>Medium Rectangle</h2>
        <GptBanner
          adUnitPath="/67551462/aryzap-home"
          sizes={[[300, 250], [336, 280]]}
          slotId="med-rect-1"
        />

        <br />
        <button onClick={() => setShowInterstitial(true)}>
          Show Interstitial
        </button>

        <GptInterstitial
          adUnitPath="/67551462/aryzap-interstitial"
          sizes={[[320, 480], [768, 1024], [970, 250]]}
          isVisible={showInterstitial}
          onClose={() => setShowInterstitial(false)}
        />
      </div>
    </GptProvider>
  );
}
