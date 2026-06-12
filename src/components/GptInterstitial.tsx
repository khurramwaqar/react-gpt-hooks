'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGpt } from '../hooks/useGpt';
import { useGptEvent } from '../hooks/useGptEvent';
import { registerSlot, displaySlot, destroySlots, generateSlotId } from '../utils/slotManager';
import type { GptInterstitialProps, Slot } from '../types';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 2147483647,
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  background: 'rgba(255,255,255,0.2)',
  border: 'none',
  color: '#fff',
  fontSize: 24,
  cursor: 'pointer',
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

const loadingStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: 16,
};

const errorStyle: React.CSSProperties = {
  color: '#ff4444',
  fontSize: 16,
};

export function GptInterstitial(props: GptInterstitialProps) {
  const {
    adUnitPath,
    sizes,
    isVisible,
    onClose,
    onRenderEnded,
    onRequestFailed,
    autoCloseDuration = 30000,
  } = props;

  const { googletag, isLoaded } = useGpt();
  const slotId = useRef(generateSlotId('gpt-interstitial')).current;
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'empty' | 'error'>('loading');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slotRef = useRef<Slot | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
  }, []);

  useGptEvent(
    'slotRenderEnded',
    (event) => {
      if (event.slot.getSlotElementId() !== slotId) return;

      if (event.isEmpty) {
        setLoadState('empty');
        onRequestFailed?.(event);
        setTimeout(onClose, 0);
      } else {
        setLoadState('loaded');
        onRenderEnded?.(event);
      }
    },
    slotId
  );

  useEffect(() => {
    if (!isVisible) {
      clearTimers();
      setLoadState('loading');
      return;
    }

    if (!googletag || !isLoaded) return;

    setLoadState('loading');

    const registered = registerSlot(googletag, adUnitPath, sizes, slotId);
    if (!registered) {
      setLoadState('error');
      return;
    }

    slotRef.current = registered.slot;

    displaySlot(googletag, slotId);

    autoCloseRef.current = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => {
      clearTimers();
      if (slotRef.current) {
        destroySlots(googletag, [slotRef.current]);
        slotRef.current = null;
      }
    };
  }, [isVisible, googletag, isLoaded, adUnitPath, sizes, slotId, onClose, autoCloseDuration, clearTimers]);

  if (typeof window === 'undefined') return null;
  if (!isVisible) return null;
  if (!googletag || !isLoaded) return null;

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <button
        style={closeButtonStyle}
        onClick={onClose}
        aria-label="Close interstitial ad"
      >
        &times;
      </button>

      {loadState === 'loading' && (
        <div style={loadingStyle}>Loading ad...</div>
      )}

      {loadState === 'loaded' && (
        <div id={slotId} ref={containerRef} suppressHydrationWarning />
      )}

      {loadState === 'empty' && (
        <div style={errorStyle}>Ad not available</div>
      )}

      {loadState === 'error' && (
        <div style={errorStyle}>Failed to load ad</div>
      )}
    </div>
  );
}
