import { TaleContent } from "../types/tale";
import { UserPreferenceWeights } from "../types/recommendation";
import { extractKeywords } from "./extractKeywords";

/**
 * 주어진 설화와 사용자 가중치 벡터를 바탕으로 개인화 추천 점수를 계산합니다.
 */
export function computePersonalizedScore(
  tale: TaleContent,
  weights: UserPreferenceWeights
): number {
  let categoryScore = 0;
  let keywordScore = 0;

  // 1. 카테고리 점수
  for (const cat of tale.categories) {
    const w = weights.categoryWeights[cat] || 0;
    categoryScore += w;
  }

  // 2. 키워드 점수
  const keywords = extractKeywords(tale.description);
  for (const kw of keywords) {
    const w = weights.keywordWeights[kw] || 0;
    keywordScore += w;
  }

  //console.log(`${tale.title} : `, keywords);

  const totalScore = categoryScore + keywordScore;

  /*
  console.log(
    `[DEBUG] "${tale.title}" → Category: ${categoryScore.toFixed(3)}, ` +
      `Keyword: ${keywordScore.toFixed(3)}, Total: ${totalScore.toFixed(3)}`
  );
  */

  return totalScore;
}

/**
 * 전체 설화 리스트에 대해 개인화 추천 점수를 부여하고, 높은 순으로 정렬된 리스트를 반환합니다.
 * @param tales 전체 설화 리스트
 * @param weights 사용자 가중치 벡터
 * @param limit 추천 개수 제한 (기본값 10개)
 */
export function getRecommendedTales(
  tales: TaleContent[],
  weights: UserPreferenceWeights,
  limit: number = 10
): TaleContent[] {
  const scoredTales = tales.map((tale) => {
    const score = computePersonalizedScore(tale, weights);
    return { tale, score };
  });

  return scoredTales
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.tale);
}
