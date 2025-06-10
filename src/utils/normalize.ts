/**
 * 주어진 가중치 맵을 정규화합니다.
 * L1 정규화: 전체 합이 1이 되도록 각 항목을 비율로 변환합니다.
 * 값이 모두 0일 경우, 정규화 없이 원본을 반환합니다.
 */

export function normalizeWeights(
  weights: Record<string, number>
): Record<string, number> {
  const total = Object.values(weights).reduce(
    (sum, val) => sum + Math.abs(val),
    0
  );

  if (total === 0) return { ...weights }; // 0으로 나눌 수 없으므로 복사만 반환

  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    normalized[key] = value / total;
  }

  return normalized;
}
