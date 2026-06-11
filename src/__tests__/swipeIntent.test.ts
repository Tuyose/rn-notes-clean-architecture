/**
 * Tests for swipe intent decision logic.
 */
import {
  getSwipeIntent,
  getRevealOffset,
  clampSwipe,
} from '../features/notes/presentation/utils/swipeIntent';

const SCREEN_WIDTH = 400;

describe('getSwipeIntent', () => {
  describe('left swipe (archive)', () => {
    it('small left swipe snaps back', () => {
      // 10% of screen = 40px
      const intent = getSwipeIntent(-40, 0.2, SCREEN_WIDTH);
      expect(intent).toBe('snap-back');
    });

    it('medium left swipe reveals archive only', () => {
      // 25% of screen = 100px
      const intent = getSwipeIntent(-100, 0.3, SCREEN_WIDTH);
      expect(intent).toBe('reveal-archive');
    });

    it('large left swipe without velocity reveals archive', () => {
      // 50% of screen = 200px, slow velocity
      const intent = getSwipeIntent(-200, 0.2, SCREEN_WIDTH);
      expect(intent).toBe('reveal-archive');
    });

    it('full left swipe with velocity executes archive', () => {
      // 60% of screen = 240px, fast velocity
      const intent = getSwipeIntent(-240, 0.8, SCREEN_WIDTH);
      expect(intent).toBe('execute-archive');
    });

    it('very far left swipe without velocity executes archive', () => {
      // 75% of screen = 300px, any velocity
      const intent = getSwipeIntent(-300, 0.1, SCREEN_WIDTH);
      expect(intent).toBe('execute-archive');
    });
  });

  describe('right swipe (delete)', () => {
    it('small right swipe snaps back', () => {
      const intent = getSwipeIntent(30, 0.1, SCREEN_WIDTH);
      expect(intent).toBe('snap-back');
    });

    it('medium right swipe reveals delete only', () => {
      // 20% of screen = 80px
      const intent = getSwipeIntent(80, 0.2, SCREEN_WIDTH);
      expect(intent).toBe('reveal-delete');
    });

    it('large right swipe without velocity reveals delete', () => {
      const intent = getSwipeIntent(180, 0.3, SCREEN_WIDTH);
      expect(intent).toBe('reveal-delete');
    });

    it('full right swipe with velocity executes delete', () => {
      const intent = getSwipeIntent(250, 0.7, SCREEN_WIDTH);
      expect(intent).toBe('execute-delete');
    });

    it('very far right swipe without velocity executes delete', () => {
      const intent = getSwipeIntent(320, 0.1, SCREEN_WIDTH);
      expect(intent).toBe('execute-delete');
    });
  });

  describe('boundary cases', () => {
    it('exactly at 15% snaps back', () => {
      const intent = getSwipeIntent(-60, 0.1, SCREEN_WIDTH);
      expect(intent).toBe('snap-back');
    });

    it('just past 15% reveals', () => {
      const intent = getSwipeIntent(-65, 0.1, SCREEN_WIDTH);
      expect(intent).toBe('reveal-archive');
    });

    it('at 55% with low velocity reveals', () => {
      const intent = getSwipeIntent(-220, 0.4, SCREEN_WIDTH);
      expect(intent).toBe('reveal-archive');
    });

    it('at 56% with high velocity executes', () => {
      const intent = getSwipeIntent(-224, 0.6, SCREEN_WIDTH);
      expect(intent).toBe('execute-archive');
    });

    it('zero distance snaps back', () => {
      const intent = getSwipeIntent(0, 0, SCREEN_WIDTH);
      expect(intent).toBe('snap-back');
    });
  });
});

describe('getRevealOffset', () => {
  it('returns 30% of screen width', () => {
    expect(getRevealOffset(400)).toBe(120);
    expect(getRevealOffset(375)).toBe(112.5);
  });
});

describe('clampSwipe', () => {
  it('clamps positive value to max', () => {
    expect(clampSwipe(500, 300)).toBe(300);
  });

  it('clamps negative value to -max', () => {
    expect(clampSwipe(-500, 300)).toBe(-300);
  });

  it('returns value within range', () => {
    expect(clampSwipe(100, 300)).toBe(100);
    expect(clampSwipe(-100, 300)).toBe(-100);
  });

  it('handles zero', () => {
    expect(clampSwipe(0, 300)).toBe(0);
  });
});
