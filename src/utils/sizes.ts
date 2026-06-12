import type { AdSize } from '../types';

export const AD_SIZES: Record<string, AdSize[]> = {
  LEADERBOARD: [
    [728, 90],
    [970, 90],
  ],
  LEADERBOARD_XL: [
    [728, 90],
    [970, 90],
    [970, 250],
  ],
  MEDIUM_RECTANGLE: [
    [300, 250],
    [336, 280],
  ],
  WIDE_SKYSCRAPER: [[160, 600]],
  SKYSCRAPER: [
    [120, 600],
    [160, 600],
    [300, 600],
  ],
  MOBILE_BANNER: [
    [320, 50],
    [320, 100],
  ],
  BANNER: [[468, 60]],
  LARGE_BANNER: [[970, 250]],
  BILLBOARD: [
    [970, 250],
    [980, 120],
    [930, 180],
  ],
  INTERSTITIAL: [
    [320, 480],
    [768, 1024],
    [970, 250],
  ],
};
