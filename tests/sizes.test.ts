import { describe, it, expect } from 'vitest';
import { AD_SIZES } from '../src/utils/sizes';

describe('AD_SIZES', () => {
  it('contains all preset sizes', () => {
    expect(AD_SIZES.LEADERBOARD).toEqual([[728, 90], [970, 90]]);
    expect(AD_SIZES.MEDIUM_RECTANGLE).toEqual([[300, 250], [336, 280]]);
    expect(AD_SIZES.MOBILE_BANNER).toEqual([[320, 50], [320, 100]]);
    expect(AD_SIZES.BANNER).toEqual([[468, 60]]);
    expect(AD_SIZES.SKYSCRAPER).toEqual([[120, 600], [160, 600], [300, 600]]);
    expect(AD_SIZES.BILLBOARD).toEqual([[970, 250], [980, 120], [930, 180]]);
    expect(AD_SIZES.INTERSTITIAL).toEqual([[320, 480], [768, 1024], [970, 250]]);
  });

  it('each preset is an array of [width, height] tuples', () => {
    for (const [key, sizes] of Object.entries(AD_SIZES)) {
      for (const size of sizes) {
        expect(Array.isArray(size)).toBe(true);
        expect(size).toHaveLength(2);
        expect(typeof size[0]).toBe('number');
        expect(typeof size[1]).toBe('number');
      }
    }
  });
});
