import { TaleContent } from "./tale";

// 사용자 개인화 가중치 벡터
export interface UserPreferenceWeights {
  categoryWeights: Record<string, number>;
  keywordWeights: Record<string, number>;
}

export interface OnboardingInput {
  ageGroup: string;
  gender: string;
  categories: string[];
  keywords: string[];
}

export interface StoredMyTale {
  userId: number;
  completedAt: string;
  storyId: string[];
  tale: TaleContent;
  userRating: number;
}
