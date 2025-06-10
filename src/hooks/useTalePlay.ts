import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useCharacterStore } from "../stores/useCharacterStore";
import { useStoryStore } from "../stores/useStoryStore";
import { parseAudioPath } from "../utils/parseAudioPath";
import { useAuthStore } from "../stores/useAuthStore";
import seolmun from "../mocks/scriptInfo";

import { TaleContent, TalePage } from "../types/tale";

interface TalePlayOptions {
  talePages: Record<string, TalePage>;
  totalPageNum: number;
  initialPageKey?: string;
  isParentLoading?: boolean;
}

export function useTalePlay({
  talePages,
  totalPageNum,
  initialPageKey,
  isParentLoading,
}: TalePlayOptions) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { ttsConfig, selectedTaleDetail, fontConfig, ttsEnabled } =
    useStoryStore();

  // 잘못된 초기화 방지
  const isReady = Object.keys(talePages).length > 0 && totalPageNum > 0;
  const [pageKey, setPageKey] = useState(initialPageKey ?? "1");
  const [pageNum, setPageNum] = useState(1);
  const [history, setHistory] = useState<string[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [showControlBar, setShowControlBar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentPage = talePages[pageKey ?? "1"];
  const hasChoices = !!currentPage?.choices?.length;

  const audioUrl = parseAudioPath(
    selectedTaleDetail?.title || "",
    ttsConfig.voiceIndex,
    pageKey
  );

  const { audio, toggleAudio, replay, playManually } = useAudioPlayer(
    audioUrl || currentPage.audioUrl,
    isLoading
  );

  const preloadedPagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const entries = Object.entries(talePages);

    const preloadPromises = entries.map(([key, page]) => {
      return new Promise<void>((resolve) => {
        if (preloadedPagesRef.current.has(key)) {
          resolve(); // 이미 preload된 경우
          return;
        }
        const img = new Image();
        img.onload = () => {
          preloadedPagesRef.current.add(key);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Image failed to load: ${page.imageUrl}`);
          resolve(); // 에러 발생해도 처리 완료
        };
        img.src = page.imageUrl;
        //console.log(img.src);
      });
    });

    Promise.all(preloadPromises).then(() => {
      setIsLoading(false);
      //console.log(preloadedPagesRef);
    });
  }, []);

  useEffect(() => {
    if (isReady && initialPageKey && pageKey !== initialPageKey) {
      setPageKey(initialPageKey);
    }
  }, [initialPageKey, isReady]);

  useEffect(() => {
    // 화면 로딩이 끝났고, 오디오 로딩도 끝났고, 초기 진입 페이지라면
    if (!isParentLoading && !isLoading && pageNum === 1) {
      const timer = setTimeout(() => {
        playManually();
      }, 2000); // 2s 후 재생
      return () => clearTimeout(timer);
    }
  }, [isParentLoading, isLoading]);

  useEffect(() => {
    // 페이지가 넘어간 경우에만 (pageNum > 1)
    if (!isLoading && pageNum > 1) {
      const timer = setTimeout(() => {
        playManually();
      }, 1000); // 페이지 전환 후 약간의 딜레이 후 재생
      return () => clearTimeout(timer);
    }
  }, [pageKey]);

  useEffect(() => {
    console.log(`rating: ${rating}`);
  }, [rating]);

  const goToNextPage = (nextKey: string) => {
    if (nextKey === "end") {
      setShowCompleteModal(true);
      return;
    }
    setHistory((prev) => [...prev, pageKey]);
    setPageKey(nextKey);
    setPageNum((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentPage.next && currentPage.next !== "end") {
      goToNextPage(currentPage.next);
    } else if (currentPage.next === "end") {
      setShowCompleteModal(true);
    }
  };

  const handleChoice = (nextKey: string) => {
    goToNextPage(nextKey);
  };

  const handlePrev = () => {
    setHistory((prev) => {
      const newHistory = [...prev];
      const last = newHistory.pop();
      if (last) {
        setPageNum(pageNum - 1);
        setPageKey(last);
      }
      return newHistory;
    });
  };

  const handleGoToLibrary = () => {
    handleCompleteTale();

    navigate("/lib");
  };

  const handleCompleteTale = () => {
    if (user && selectedTaleDetail) {
      const finalStoryId = [...history, pageKey];

      const storedTale = localStorage.getItem("myTale-storage");
      const parsedTale = storedTale ? JSON.parse(storedTale) : [];

      const tale: TaleContent = {
        id: selectedTaleDetail.id,
        title: selectedTaleDetail.title,
        location: selectedTaleDetail.location,
        categories: selectedTaleDetail.categories,
        description: selectedTaleDetail.description,
        score: selectedTaleDetail.score,
        thumbnail: selectedTaleDetail.thumbnail,
      };

      parsedTale.push({
        userId: user.id,
        tale: tale,
        storyId: finalStoryId,
        userRating: rating,
        completedAt: new Date().toISOString(),
      });

      localStorage.setItem("myTale-storage", JSON.stringify(parsedTale));

      const { hasCharacter, addCharacter } = useCharacterStore.getState();
      if (tale.id && !hasCharacter(tale.id)) {
        addCharacter({
          characterId: Date.now(), // 실제 구현 시 고유 숫자 ID로 생성
          tale,
          imageUrl: "/assets/images/ar-char1.png",
        });
      }
    }

    setShowCompleteModal(false);
  };

  return {
    audio,
    toggleAudio,
    replay,
    playManually,
    totalPageNum,
    isLoading,
    pageKey,
    pageNum,
    currentPage,
    hasChoices,
    fontConfig,
    showControlBar,
    setShowControlBar,
    showCompleteModal,
    setShowCompleteModal,
    rating,
    setRating,
    handleNext,
    handlePrev,
    handleChoice,
    handleGoToLibrary,
    handleCompleteTale,
  };
}
