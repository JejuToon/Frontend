import { useRef } from "react";

interface UseSwipeTalePlayProps {
  onNext: () => void;
  onPrev: () => void;
  onShowNav: () => void;
  pageNum: number;
  totalPageNum: number;
  hasChoices: boolean;
  disabled?: boolean; // showControlBar 같은 상태
  threshold?: number;
}

export function useSwipeTalePlay({
  onNext,
  onPrev,
  onShowNav,
  pageNum,
  totalPageNum,
  hasChoices,
  disabled = false,
  threshold = 50,
}: UseSwipeTalePlayProps) {
  const pointerStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (disabled) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;

    const isHorizontalSwipe =
      Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold;
    const isSwipeUp = dy < -threshold;

    if (isHorizontalSwipe) {
      if (dx > 0 && pageNum > 0) {
        onPrev();
      } else if (dx < 0 && pageNum < totalPageNum && !hasChoices) {
        onNext();
      }
    } else if (isSwipeUp) {
      onShowNav();
    }
  };

  return { handlePointerDown, handlePointerUp };
}
