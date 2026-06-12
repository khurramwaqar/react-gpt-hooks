'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGpt } from './useGpt';
import {
  registerSlot,
  displaySlot,
  destroySlots,
  refreshSlots,
  setTargeting,
  generateSlotId,
  addSlotEventListener,
} from '../utils/slotManager';
import type { UseGptSlotOptions, UseGptSlotResult } from '../types';

export function useGptSlot(options: UseGptSlotOptions): UseGptSlotResult {
  const { googletag, isLoaded } = useGpt();
  const {
    adUnitPath,
    sizes,
    slotId: externalSlotId,
    targeting,
    collapseEmptyDiv,
  } = options;

  const slotId = externalSlotId || generateSlotId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<ReturnType<typeof registerSlot> | null>(null);
  const [isLoadedSlot, setIsLoadedSlot] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!googletag || !isLoaded) return;

    const registered = registerSlot(googletag, adUnitPath, sizes, slotId);
    if (!registered) return;

    slotRef.current = registered;

    if (targeting) {
      setTargeting(registered.slot, targeting);
    }

    if (collapseEmptyDiv) {
      googletag.pubads().collapseEmptyDivs(true);
    }

    displaySlot(googletag, slotId);

    return () => {
      destroySlots(googletag, [registered.slot]);
      slotRef.current = null;
    };
  }, [googletag, isLoaded, adUnitPath, slotId, sizes, targeting, collapseEmptyDiv]);

  useEffect(() => {
    if (!googletag || !isLoaded) return;

    const unsubRenderEnded = addSlotEventListener(
      googletag,
      'slotRenderEnded',
      slotId,
      (event) => {
        if (!mountedRef.current) return;
        setIsLoadedSlot(true);
        if (event.isEmpty) {
          setIsEmpty(true);
        }
      }
    );

    return () => {
      unsubRenderEnded();
    };
  }, [googletag, isLoaded, slotId]);

  const refresh = useCallback(() => {
    if (!googletag || !slotRef.current) return;
    setIsLoadedSlot(false);
    setIsEmpty(false);
    refreshSlots(googletag, [slotRef.current.slot]);
  }, [googletag]);

  const destroy = useCallback(() => {
    if (!googletag || !slotRef.current) return;
    destroySlots(googletag, [slotRef.current.slot]);
    slotRef.current = null;
    setIsLoadedSlot(false);
    setIsEmpty(false);
  }, [googletag]);

  return {
    containerRef,
    slotId,
    isLoaded: isLoadedSlot,
    isEmpty,
    refresh,
    destroy,
  };
}
