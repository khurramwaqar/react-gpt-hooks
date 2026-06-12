import type { Slot, AdSize, Googletag, SlotEvent, GptEventType, PubAdsService } from '../types';

let counter = 0;

export function generateSlotId(prefix = 'gpt-slot'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function resetSlotCounter(): void {
  counter = 0;
}

export function defineSlot(
  googletag: Googletag,
  adUnitPath: string,
  sizes: AdSize[],
  slotId: string
): Slot | null {
  try {
    const slot = googletag.defineSlot(adUnitPath, sizes, slotId);
    if (!slot) return null;
    return slot;
  } catch {
    return null;
  }
}

export function addService(slot: Slot, service: PubAdsService): void {
  slot.addService(service);
}

export function displaySlot(googletag: Googletag, slotId: string): void {
  googletag.display(slotId);
}

export function destroySlots(
  googletag: Googletag,
  slots?: Slot[]
): void {
  googletag.destroySlots(slots);
}

export function refreshSlots(
  googletag: Googletag,
  slots?: Slot[]
): void {
  const pubads = googletag.pubads();
  pubads.refresh(slots);
}

export function setTargeting(
  slot: Slot,
  targeting: Record<string, string | string[]>
): void {
  for (const [key, value] of Object.entries(targeting)) {
    slot.setTargeting(key, value);
  }
}

export interface RegisteredSlot {
  slot: Slot;
  slotId: string;
}

export function registerSlot(
  googletag: Googletag,
  adUnitPath: string,
  sizes: AdSize[],
  slotId: string
): RegisteredSlot | null {
  const slot = defineSlot(googletag, adUnitPath, sizes, slotId);
  if (!slot) return null;
  const pubads = googletag.pubads();
  addService(slot, pubads);
  return { slot, slotId };
}

export function addEventListener(
  googletag: Googletag,
  eventType: GptEventType,
  callback: (event: SlotEvent) => void
): () => void {
  const pubads = googletag.pubads();
  const handler = (event: SlotEvent) => {
    callback(event);
  };
  pubads.addEventListener(eventType, handler);
  return () => {
    pubads.removeEventListener(eventType, handler);
  };
}

export function addSlotEventListener(
  googletag: Googletag,
  eventType: GptEventType,
  slotId: string,
  callback: (event: SlotEvent) => void
): () => void {
  return addEventListener(googletag, eventType, (event) => {
    if (event.slot.getSlotElementId() === slotId) {
      callback(event);
    }
  });
}
