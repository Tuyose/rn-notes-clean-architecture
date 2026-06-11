export type SwipeIntent =
  | 'snap-back'
  | 'reveal-archive'
  | 'reveal-delete'
  | 'execute-archive'
  | 'execute-delete';

/**
 * Pure function that determines swipe intent from distance and velocity.
 *
 * Thresholds (as fraction of screen width):
 * - < 15%: snap back (too small)
 * - 15–40%: reveal action (show action, don't execute)
 * - > 55% with velocity OR > 70% without: execute action
 *
 * This keeps small/medium swipes safe and only executes on clearly intentional gestures.
 */
export function getSwipeIntent(
  distance: number,
  velocity: number,
  screenWidth: number,
): SwipeIntent {
  const fraction = Math.abs(distance) / screenWidth;
  const absVelocity = Math.abs(velocity);
  const isLeftSwipe = distance < 0;

  // Full swipe with enough velocity — execute
  if (fraction > 0.55 && absVelocity > 0.5) {
    return isLeftSwipe ? 'execute-archive' : 'execute-delete';
  }

  // Full swipe without velocity but very far — execute
  if (fraction > 0.7) {
    return isLeftSwipe ? 'execute-archive' : 'execute-delete';
  }

  // Medium swipe — reveal action
  if (fraction > 0.15) {
    return isLeftSwipe ? 'reveal-archive' : 'reveal-delete';
  }

  // Small swipe — snap back
  return 'snap-back';
}

/**
 * Get the translateX value for a revealed action state.
 * This is how far the row shifts to show the action behind it.
 */
export function getRevealOffset(screenWidth: number): number {
  return screenWidth * 0.3;
}

/**
 * Clamp a swipe distance to prevent over-scrolling.
 */
export function clampSwipe(dx: number, max: number): number {
  return Math.max(-max, Math.min(max, dx));
}
