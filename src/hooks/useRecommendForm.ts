import { useState, useEffect, useCallback } from "react";

export function useRecommendForm() {
  const [showRecommendForm, setShowRecommendForm] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const openRecommendForm = useCallback(() => {
    setAnimateOut(false);
    window.history.pushState(null, "", window.location.href);
    setShowRecommendForm(true);
  }, []);

  const closeRecommendForm = useCallback(() => {
    setAnimateOut(true);
    window.history.back();
    setTimeout(() => setShowRecommendForm(false), 300);
  }, []);

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
    showRecommendForm,
    animateOut,
    openRecommendForm,
    closeRecommendForm,
  };
}
