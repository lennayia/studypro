import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for touch gestures on mobile
 * Supports: swipe left, swipe right, swipe up, swipe down, long press
 *
 * Usage:
 * const touchHandlers = useTouchGestures({
 *   onSwipeLeft: () => console.log('Swiped left!'),
 *   onSwipeRight: () => console.log('Swiped right!'),
 * });
 * <div {...touchHandlers}>Swipeable content</div>
 */
export const useTouchGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onLongPress,
  threshold = 50, // Minimum distance for swipe
  longPressDelay = 500, // Delay for long press in ms
} = {}) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const longPressTimer = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }
  };

  const handleTouchMove = (e) => {
    // Cancel long press if finger moves
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = (e) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    touchEndX.current = e.changedTouches[0].clientX;
    touchEndY.current = e.changedTouches[0].clientY;

    const diffX = touchEndX.current - touchStartX.current;
    const diffY = touchEndY.current - touchStartY.current;

    // Determine swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > threshold) {
        if (diffY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

/**
 * Hook for pull-to-refresh gesture
 * Returns: { isPulling, pullDistance, ...touchHandlers }
 */
export const usePullToRefresh = ({ onRefresh, threshold = 80 } = {}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);

  const handleTouchStart = (e) => {
    // Only start if at top of page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (startY.current === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold) {
      await onRefresh?.();
    }

    setIsPulling(false);
    setPullDistance(0);
    startY.current = 0;
  };

  return {
    isPulling,
    pullDistance,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

/**
 * Hook for swipeable card/list items
 * Common pattern: swipe to delete, swipe to archive, etc.
 */
export const useSwipeableItem = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  velocityThreshold = 0.3,
} = {}) => {
  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const startTime = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    setOffset(diff);
  };

  const handleTouchEnd = () => {
    const timeDiff = Date.now() - startTime.current;
    const velocity = Math.abs(offset) / timeDiff;

    // Check if swipe is strong enough
    if (Math.abs(offset) > threshold || velocity > velocityThreshold) {
      if (offset > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    // Reset
    setOffset(0);
    setIsSwiping(false);
  };

  return {
    offset,
    isSwiping,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};
