import { useRef } from "react";

export function useSwipeTabs<T extends string>(
  currentTab: T,
  setTab: (tab: T) => void,
  tabs: T[]
) {
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    const threshold = 50; // 스와이프 최소 거리
    const currentIndex = tabs.indexOf(currentTab);
    if (deltaX > threshold && currentIndex > 0) {
      setTab(tabs[currentIndex - 1]); // 왼쪽으로 스와이프 → 이전 탭
    } else if (deltaX < -threshold && currentIndex < tabs.length - 1) {
      setTab(tabs[currentIndex + 1]); // 오른쪽으로 스와이프 → 다음 탭
    }

    touchStartX.current = null;
  };

  return { onTouchStart, onTouchEnd };
}
