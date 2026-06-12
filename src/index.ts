export { GptProvider } from './components/GptProvider';
export { GptBanner } from './components/GptBanner';
export { GptInterstitial } from './components/GptInterstitial';
export { useGptSlot } from './hooks/useGptSlot';
export { useGptEvent } from './hooks/useGptEvent';
export { useGpt } from './hooks/useGpt';
export { AD_SIZES } from './utils/sizes';

export type {
  Googletag,
  PubAdsService,
  Slot,
  AdSize,
  SizeMappingArray,
  SizeMappingBuilder,
  SlotEvent,
  GptEventType,
  GptProviderOptions,
  GptBannerProps,
  GptInterstitialProps,
  UseGptSlotOptions,
  UseGptSlotResult,
  GptContextValue,
} from './types';
