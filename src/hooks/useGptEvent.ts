'use client';

import { useEffect, useRef } from 'react';
import { useGpt } from './useGpt';
import { addEventListener, addSlotEventListener } from '../utils/slotManager';
import type { GptEventType, SlotEvent } from '../types';

export type GptEventCallback = (event: SlotEvent) => void;

export function useGptEvent(
  eventType: GptEventType,
  callback: GptEventCallback,
  slotId?: string
): void {
  const { googletag, isLoaded } = useGpt();
  const callbackRef = useRef<GptEventCallback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!googletag || !isLoaded) return;

    const handler = (event: SlotEvent) => {
      callbackRef.current(event);
    };

    const unsub = slotId
      ? addSlotEventListener(googletag, eventType, slotId, handler)
      : addEventListener(googletag, eventType, handler);

    return () => {
      unsub();
    };
  }, [googletag, isLoaded, eventType, slotId]);
}
