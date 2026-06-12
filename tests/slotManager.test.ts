import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSlotId, resetSlotCounter } from '../src/utils/slotManager';

describe('slotManager', () => {
  beforeEach(() => {
    resetSlotCounter();
  });

  describe('generateSlotId', () => {
    it('generates unique slot ids', () => {
      const id1 = generateSlotId();
      const id2 = generateSlotId();
      expect(id1).not.toBe(id2);
    });

    it('uses default prefix', () => {
      const id = generateSlotId();
      expect(id).toMatch(/^gpt-slot-\d+$/);
    });

    it('uses custom prefix', () => {
      const id = generateSlotId('custom');
      expect(id).toMatch(/^custom-\d+$/);
    });
  });
});
