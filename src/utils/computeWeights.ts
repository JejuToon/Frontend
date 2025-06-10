import { categories } from "../constants/categories";

import { TaleContent } from "../types/tale";
import {
  OnboardingInput,
  UserPreferenceWeights,
  StoredMyTale,
} from "../types/recommendation";
import { extractKeywords } from "./extractKeywords";
import { normalizeWeights } from "./normalize";

const ALL_CATEGORIES = categories.map((c) => c.key);

// 메인 함수: 사용자 선호 가중치 계산
export function computeUserPreferenceWeights(
  onboarding: OnboardingInput,
  myTales: StoredMyTale[]
): UserPreferenceWeights {
  const categoryWeights: Record<string, number> = {};
  const keywordWeights: Record<string, number> = {};

  // 상수 설정
  const alpha = 1.0; // 온보딩 직접 선택 가중치
  const beta = 0.2; // 사용자 평가 반영 가중치
  const ageWeight = 0.5;
  const genderWeight = 0.5;

  // 온보딩 입력 기반
  onboarding.categories.forEach((g) => {
    categoryWeights[g] = (categoryWeights[g] || 0) + alpha;
    //console.log(`+ ${g} (온보딩 선택 카테고리): +${alpha}`);
  });

  onboarding.keywords.forEach((kw) => {
    keywordWeights[kw] = (keywordWeights[kw] || 0) + alpha;
    //console.log(`+ ${kw} (온보딩 선택 키워드): +${alpha}`);
  });

  // 연령 기반 기본 선호 반영
  const ageGroupCategoryMap: Record<string, string[]> = {
    "10대": ["개척담", "연애담"],
    "20대": ["연애담"],
    "30대": ["연애담", "인물담"],
    "40대 이상": ["신앙담"],
  };

  const ageGroupKeywordMap: Record<string, string[]> = {
    "10대": [],
    "20대": [],
    "30대": [],
    "40대 이상": [],
  };

  // 연령별 카테고리 가중치 반영
  (ageGroupCategoryMap[onboarding.ageGroup] || []).forEach((cat) => {
    categoryWeights[cat] = (categoryWeights[cat] || 0) + ageWeight;
    //console.log(`+ ${cat} (연령: ${onboarding.ageGroup}): +${ageWeight}`);
  });

  // 연령별 키워드 가중치 반영
  (ageGroupKeywordMap[onboarding.ageGroup] || []).forEach((kw) => {
    keywordWeights[kw] = (keywordWeights[kw] || 0) + ageWeight;
    //console.log(`+ ${kw} (연령: ${onboarding.ageGroup}): +${ageWeight}`);
  });

  // 성별 기반 기본 선호 반영
  const genderCategoryMap: Record<string, string[]> = {
    남성: ["개척담", "연애담"],
    여성: ["인물담", "연애담"],
  };

  const genderKeywordMap: Record<string, string[]> = {
    남성: [],
    여성: [],
  };

  // 성별별 카테고리 가중치 반영
  (genderCategoryMap[onboarding.gender] || []).forEach((cat) => {
    categoryWeights[cat] = (categoryWeights[cat] || 0) + genderWeight;
    //console.log(`+ ${cat} (성별: ${onboarding.gender}): +${genderWeight}`);
  });

  // 성별별 키워드 가중치 반영
  (genderKeywordMap[onboarding.gender] || []).forEach((kw) => {
    keywordWeights[kw] = (keywordWeights[kw] || 0) + genderWeight;
    //console.log(`+ ${kw} (성별): +${genderWeight}`);
  });

  // 사용자 설화 평가 기반 학습
  for (const myTale of myTales) {
    const { tale, userRating } = myTale;
    if (!tale || !userRating) continue;

    const delta = beta * (userRating - 3); // 중립값 3 기준

    // 사용자 평가는 우선 카테고리에만 반영
    tale.categories.forEach((cat) => {
      categoryWeights[cat] = (categoryWeights[cat] || 0) + delta;
      //console.log(`+ ${cat} (사용자 평가 ${userRating}): +${delta.toFixed(2)}`);
    });
  }

  // 카테고리 누락 방지용 0 채우기
  const ALL_CATEGORIES = categories.map((c) => c.key);
  ALL_CATEGORIES.forEach((cat) => {
    if (!(cat in categoryWeights)) categoryWeights[cat] = 0;
  });

  const normalizedCategory = normalizeWeights(categoryWeights);
  const normalizedKeyword = normalizeWeights(keywordWeights);

  //console.log("정규화 결과 (카테고리):", normalizedCategory);
  //console.log("정규화 결과 (키워드):", normalizedKeyword);

  // 정규화 후 반환
  return {
    categoryWeights: normalizedCategory,
    keywordWeights: normalizedKeyword,
  };
}
