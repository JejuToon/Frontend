/**
 * 배열을 랜덤하게 섞어서 새 배열로 반환합니다.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const a = array.slice(); // 원본 훼손 방지
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 배열을 셔플한 뒤, 앞에서부터 count개만큼 잘라서 반환합니다.
 */
export function getRandomSlice<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}
