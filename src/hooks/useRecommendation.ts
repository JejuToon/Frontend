import { useState, useEffect, useCallback } from "react";
import { OnboardingInput, StoredMyTale } from "../types/recommendation";
import { TaleContent } from "../types/tale";

import { useRecommendationStore } from "../stores/useRecommendationStore";
import { computeUserPreferenceWeights } from "../utils/computeWeights";
import { getRecommendedTales } from "../utils/computeScore";

export function useRecommendation(allTales: TaleContent[]) {
  const {
    setWeights,
    setRecommendedTales,
    setOnboardingInput,
    setLoading,
    loading,
    weights,
    recommendedTales,
    onboardingInput,
    clearRecommendations,
  } = useRecommendationStore();

  const [showRecommendForm, setShowRecommendForm] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  // 추천 계산 적용 함수
  const applyRecommendation = useCallback(() => {
    if (!allTales || !onboardingInput) return;

    setLoading(true);

    const stored: StoredMyTale[] = JSON.parse(
      localStorage.getItem("myTale-storage") || "[]"
    );

    const weights = computeUserPreferenceWeights(onboardingInput, stored);
    const top5Tales = getRecommendedTales(allTales, weights, 5);

    //console.log("[DEBUG] 가중치:", weights);
    //console.log("[DEBUG] 추천된 설화:", top5Tales);

    setWeights(weights);
    setRecommendedTales(top5Tales);

    setTimeout(() => setLoading(false), 3000);
  }, [onboardingInput, allTales, setWeights, setRecommendedTales]);

  // 추천 폼 열기
  const openRecommendForm = useCallback(() => {
    setAnimateOut(false);
    window.history.pushState(null, "", window.location.href);
    setShowRecommendForm(true);
  }, []);

  // 추천 폼 닫기
  const closeRecommendForm = useCallback(() => {
    setAnimateOut(true);
    window.history.back();
    setTimeout(() => setShowRecommendForm(false), 300);
  }, []);

  // 브라우저 뒤로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      setAnimateOut(true);
      setTimeout(() => setShowRecommendForm(false), 300);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return {
    // 추천 상태
    weights,
    recommendedTales,
    onboardingInput,
    clearRecommendations,

    // 추천 폼 제어
    showRecommendForm,
    animateOut,
    openRecommendForm,
    closeRecommendForm,

    // 추천 계산
    applyRecommendation,
    loading,
  };
}
