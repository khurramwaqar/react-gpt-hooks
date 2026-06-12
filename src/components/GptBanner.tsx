'use client';

import { useEffect, useRef, useState } from 'react';
import { useGpt } from '../hooks/useGpt';
import { useGptEvent } from '../hooks/useGptEvent';
import { registerSlot, displaySlot, destroySlots, setTargeting, generateSlotId } from '../utils/slotManager';
import type { GptBannerProps, Slot } from '../types';

export function GptBanner(props: GptBannerProps) {
  const {
    adUnitPath,
    sizes,
    slotId: externalSlotId,
    collapseEmptyDiv,
    lazyLoad,
    targeting,
    onRenderEnded,
    onImpressionViewable,
    onSlotRequested,
  } = props;

  const { googletag, isLoaded } = useGpt();
  const slotId = useRef(externalSlotId || generateSlotId()).current;
  const [visible, setVisible] = useState(!lazyLoad);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<Slot | null>(null);

  useGptEvent('slotRenderEnded', (event) => {
    if (event.slot.getSlotElementId() === slotId) {
      onRenderEnded?.(event);
    }
  });

  useGptEvent('impressionViewable', (event) => {
    if (event.slot.getSlotElementId() === slotId) {
      onImpressionViewable?.(event);
    }
  });

  useGptEvent('slotRequested', (event) => {
    if (event.slot.getSlotElementId() === slotId) {
      onSlotRequested?.(event);
    }
  });

  useEffect(() => {
    if (!googletag || !isLoaded || !visible) return;

    const registered = registerSlot(googletag, adUnitPath, sizes, slotId);
    if (!registered) return;

    slotRef.current = registered.slot;

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
  }, [googletag, isLoaded, visible, adUnitPath, sizes, slotId, targeting, collapseEmptyDiv]);

  useEffect(() => {
    if (!lazyLoad || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: lazyLoad.rootMargin, threshold: lazyLoad.threshold }
    );

    observer.observe(el);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [lazyLoad]);

  return <div id={slotId} ref={containerRef} suppressHydrationWarning />;
}
