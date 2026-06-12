import type { RefObject } from 'react';

declare global {
  interface Window {
    googletag?: Googletag;
  }
}

export interface Googletag {
  cmd: Array<() => void>;
  pubads: () => PubAdsService;
  enableServices: () => void;
  defineSlot: (adUnitPath: string, sizes: AdSize[], divId: string) => Slot;
  defineOutOfPageSlot: (adUnitPath: string, divId: string) => Slot | null;
  destroySlots: (slots?: Slot[]) => void;
  display: (divId: string) => void;
  sizeMapping: () => SizeMappingBuilder;
  enums: {
    OutOfPageFormat: { INTERSTITIAL: unknown };
  };
}

export interface PubAdsService {
  enableSingleRequest: () => void;
  collapseEmptyDivs: (collapse?: boolean) => void;
  setTargeting: (key: string, value: string | string[]) => void;
  clearTargeting: (key?: string) => void;
  getTargeting: (key: string) => string[];
  setCategoryExclusion: (category: string) => void;
  clearCategoryExclusions: () => void;
  refresh: (slots?: Slot[], options?: { changeCorrelator?: boolean }) => void;
  addEventListener: (
    eventType: string,
    listener: (event: SlotEvent) => void
  ) => void;
  removeEventListener: (
    eventType: string,
    listener: (event: SlotEvent) => void
  ) => void;
}

export interface Slot {
  getSlotElementId: () => string;
  getAdUnitPath: () => string;
  getTargeting: (key: string) => string[];
  setTargeting: (key: string, value: string | string[]) => Slot;
  clearTargeting: (key?: string) => Slot;
  defineSizeMapping: (sizeMapping: SizeMappingArray) => Slot;
  getSizes: () => AdSize[];
  addService: (service: PubAdsService) => Slot;
}

export type AdSize = [number, number];

export type SizeMappingArray = Array<[AdSize, AdSize[]]>;

export interface SizeMappingBuilder {
  addSize: (viewportSize: AdSize, slotSizes: AdSize[]) => SizeMappingBuilder;
  build: () => SizeMappingArray;
}

export interface SlotEvent {
  slot: Slot;
  size?: AdSize;
  advertiserId?: number;
  campaignId?: number;
  creativeId?: number;
  creativeTemplateId?: number;
  isEmpty?: boolean;
  labelIds?: number[];
  lineItemId?: number;
  serviceName?: string;
  slotContentChanged?: boolean;
  sourceAgnosticCreativeId?: number;
  sourceAgnosticLineItemId?: number;
  useServedRendering?: boolean;
}

export type GptEventType =
  | 'impressionViewable'
  | 'slotRenderEnded'
  | 'slotVisibilityChanged'
  | 'slotOnload'
  | 'slotRequested'
  | 'slotResponseReceived'
  | 'slotResponseRendered';

export interface GptProviderOptions {
  singleRequest?: boolean;
  collapseEmptyDivs?: boolean;
  enableLazyLoad?: boolean;
  adUnitBase?: string;
}

export interface GptBannerProps {
  adUnitPath: string;
  sizes: AdSize[];
  slotId?: string;
  collapseEmptyDiv?: boolean;
  lazyLoad?: { rootMargin?: string; threshold?: number };
  targeting?: Record<string, string | string[]>;
  onRenderEnded?: (event: SlotEvent) => void;
  onImpressionViewable?: (event: SlotEvent) => void;
  onSlotRequested?: (event: SlotEvent) => void;
}

export interface GptInterstitialProps {
  adUnitPath: string;
  sizes: AdSize[];
  isVisible: boolean;
  onClose: () => void;
  onRenderEnded?: (event: SlotEvent) => void;
  onRequestFailed?: (event: SlotEvent) => void;
  autoCloseDuration?: number;
}

export interface UseGptSlotOptions {
  adUnitPath: string;
  sizes: AdSize[];
  slotId?: string;
  targeting?: Record<string, string | string[]>;
  lazyLoad?: { rootMargin?: string; threshold?: number };
  collapseEmptyDiv?: boolean;
}

export interface UseGptSlotResult {
  containerRef: RefObject<HTMLDivElement | null>;
  slotId: string;
  isLoaded: boolean;
  isEmpty: boolean;
  refresh: () => void;
  destroy: () => void;
}

export interface GptContextValue {
  googletag: Googletag | null;
  isLoaded: boolean;
  options: GptProviderOptions;
}
