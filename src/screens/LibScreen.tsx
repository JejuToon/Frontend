import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaEllipsisVertical,
  FaPersonHiking,
  FaUser,
  FaHeart,
  FaCross,
} from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

import { useSwipeTabs } from "../hooks/useSwipeTabs";

import styled, { keyframes, css } from "styled-components";
import Header from "../components/Header";
import TaleCard from "../components/TaleCard";
import CustomButton from "../components/CustomButton";
import CharacterCard from "../components/CharacterCard";
import ConfirmModal from "../components/ConfirmModal";
import Chip from "../components/Chip";
import Tabs, { TabItem } from "../components/Tabs";
import EmptyState from "../components/EmptyState";
import { TbMapSearch } from "react-icons/tb";
import { RiLoginBoxLine } from "react-icons/ri";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useCharacterStore } from "../stores/useCharacterStore";
import { useAuthStore } from "../stores/useAuthStore";

import { TaleContent } from "../types/tale";

interface userTaleContent {
  storyId: string[];
  userId: number;
  tale: TaleContent;
}

const TAB_ITEMS: TabItem[] = [
  { label: "설화", value: "tale" },
  { label: "캐릭터", value: "character" },
] as const;

type TabType = (typeof TAB_ITEMS)[number]["value"]; // "tale" | "character"

const allCategories = ["개척담", "인물담", "연애담", "신앙담"];
const categoriesIcons = [FaPersonHiking, FaUser, FaHeart, FaCross];

export default function LibScreen() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [tab, setTab] = useState<TabType>("tale");
  const [prevTab, setPrevTab] = useState<TabType>("tale"); // 이전 탭 추적
  const tabValues = TAB_ITEMS.map((item) => item.value); // ["tale", "character"]
  const { onTouchStart, onTouchEnd } = useSwipeTabs(tab, setTab, tabValues);

  const navigate = useNavigate();
  const [myTales, setMyTales] = useState<userTaleContent[]>([]);
  const [myChars, setMyChars] = useState<any>([]);
  const [showDeleteTaleModal, setShowDeleteTaleModal] = useState(false);
  const [showDeleteCharModal, setShowDeleteCharModal] = useState(false);
  const [selectedTaleIndex, setSelectedTaleIndex] = useState<number | null>(
    null
  );
  const [selectedCharIndex, setSelectedCharIndex] = useState<number | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { characters, setSelectedCharacterId } = useCharacterStore();

  const { setSelectedMarker } = useSelectedMarkerStore();

  // 방향 계산
  const animationDirection: "left" | "right" =
    prevTab === "tale" && tab === "character"
      ? "right"
      : prevTab === "character" && tab === "tale"
      ? "left"
      : "right";

  const handleTabChange = (nextTab: TabType) => {
    if (nextTab !== tab) {
      setPrevTab(tab); // 현재 tab을 prevTab에 저장
      setTab(nextTab); // 다음 탭으로 이동
    }
  };

  const handleTaleClick = (userTale: userTaleContent) => {
    localStorage.setItem("replayTale", JSON.stringify({ userTale }));
    navigate(`/tale/replay`);
  };

  const handleCharacterClick = (taleId: number) => {
    setSelectedCharacterId(taleId);
    navigate("/camera", { state: { selectedCharacterId: taleId } });
  };

  useEffect(() => {
    try {
      const storedTale = localStorage.getItem("myTale-storage");
      const parsedTale = storedTale ? JSON.parse(storedTale) : [];
      setMyTales(parsedTale);

      const storedChar = localStorage.getItem("charcter-storage");
      const parsedChar = storedChar ? JSON.parse(storedChar) : [];
      setMyChars(parsedChar);
    } catch (e) {
      console.error("JSON 파싱 실패:", e);
      setMyTales([]);
      setMyChars([]);
    }
  }, []);

  const handleRemoveTale = (index: number) => {
    const updatedTales = myTales.filter((_, i) => i !== index);
    setMyTales(updatedTales);
    localStorage.setItem("myTale-storage", JSON.stringify(updatedTales));
    setShowDeleteTaleModal(false);
  };

  const handleRemoveCharacter = (index: number) => {
    const target = characters[index];
    if (!target) return;

    useCharacterStore.getState().removeCharacter(target.tale.id);

    setShowDeleteCharModal(false);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const filteredTales = selectedCategory
    ? myTales.filter((t) => t.tale.categories?.includes(selectedCategory))
    : myTales;

  const filteredCharacters = selectedCategory
    ? characters.filter((c) => c.tale.categories?.includes(selectedCategory))
    : characters;

  const handleViewMap = (tale: TaleContent) => {
    const marker = {
      id: tale.id,
      title: tale.title,
      location: tale.location[0], // 첫 번쨰 좌표 사용
      categories: tale.categories,
      description: tale.description,
      score: tale.score,
      thumbnail: tale.thumbnail,
    };

    setSelectedMarker(marker);
    navigate("/search");
  };

  return (
    <LibScreenContainer onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Header left={<h1>내 설화</h1>} center={null} right={null} />

      {!isLoggedIn || !user ? (
        <EmptyStateGrid>
          <EmptyState
            icon={<RiLoginBoxLine />}
            title="연결된 정보가 없어요"
            description="로그인하면 이용할 수 있어요"
            onIconClick={() => navigate("/auth")}
          />
          <LoginButton onClick={() => navigate("/auth")}>로그인</LoginButton>
        </EmptyStateGrid>
      ) : (
        <>
          <Tabs<TabType>
            items={TAB_ITEMS}
            active={tab}
            onChange={handleTabChange}
          />
          {tab === "tale" ? (
            myTales.length > 0 ? (
              <>
                <ChipContainer>
                  {allCategories.map((cat, index) => {
                    const Icon = categoriesIcons[index];
                    return (
                      <Chip
                        key={cat}
                        selected={selectedCategory === cat}
                        onToggle={() => handleCategorySelect(cat)}
                        variant="category"
                      >
                        <ChipContent>
                          <Icon style={{ marginRight: 2 }} />
                          {cat}
                        </ChipContent>
                      </Chip>
                    );
                  })}
                </ChipContainer>

                <AnimatedTabContent key={tab} direction={animationDirection}>
                  <TaleList>
                    {filteredTales.map((t) => {
                      const originalIndex = myTales.findIndex(
                        (mt) => mt.tale.id === t.tale.id
                      );
                      return (
                        <TaleCard
                          key={t.tale.id}
                          id={t.tale.id}
                          title={t.tale.title}
                          description={t.tale.description}
                          thumbnailUrl={t.tale.thumbnail}
                          onClick={() => handleTaleClick(t)}
                          icon={<FaBars />}
                          onIconClick={() => {
                            setShowDeleteTaleModal(true);
                            setSelectedTaleIndex(originalIndex);
                          }}
                        >
                          <CustomButton
                            label="지도"
                            icon={<GrMapLocation />}
                            size="small"
                            variant="filled"
                            onClick={() => handleViewMap(t.tale)}
                          />
                        </TaleCard>
                      );
                    })}

                    {showDeleteTaleModal && (
                      <ConfirmModal
                        mainTitle="설화를 삭제할까요?"
                        subTitle="삭제 시 되돌릴 수 없어요"
                        onClose={() => {
                          setShowDeleteTaleModal(false);
                          setSelectedTaleIndex(null);
                        }}
                        onConfirm={() => {
                          if (selectedTaleIndex !== null) {
                            handleRemoveTale(selectedTaleIndex);
                          }
                        }}
                      />
                    )}
                  </TaleList>
                </AnimatedTabContent>
              </>
            ) : (
              <EmptyStateGrid>
                <EmptyState
                  icon={<TbMapSearch />}
                  title="저장된 설화가 없어요"
                  description="설화를 감상해 보세요"
                  onIconClick={() => navigate("/search")}
                  onDescriptionClick={() => navigate("/search")}
                />
              </EmptyStateGrid>
            )
          ) : characters.length > 0 ? (
            <>
              <ChipContainer>
                {allCategories.map((cat, index) => {
                  const Icon = categoriesIcons[index];
                  return (
                    <Chip
                      key={cat}
                      selected={selectedCategory === cat}
                      onToggle={() => handleCategorySelect(cat)}
                      variant="category"
                    >
                      <ChipContent>
                        <Icon style={{ marginRight: 2 }} />
                        {cat}
                      </ChipContent>
                    </Chip>
                  );
                })}
              </ChipContainer>

              <AnimatedTabContent key={tab} direction={animationDirection}>
                <CharacterGrid>
                  {filteredCharacters.map((c) => {
                    const originalIndex = characters.findIndex(
                      (char) => char.characterId === c.characterId
                    );
                    return (
                      <CharacterCard
                        key={c.characterId}
                        name={c.tale.title || "이름 없음"}
                        avatarUrl={c.imageUrl || ""}
                        icon={<FaBars />}
                        onClickIcon={() => {
                          setShowDeleteCharModal(true);
                          setSelectedCharIndex(originalIndex);
                        }}
                        onClick={() => handleCharacterClick(c.tale.id)}
                      />
                    );
                  })}

                  {showDeleteCharModal && (
                    <ConfirmModal
                      mainTitle="캐릭터를 삭제할까요?"
                      subTitle="삭제 시 되돌릴 수 없어요"
                      onClose={() => {
                        setShowDeleteCharModal(false);
                        setSelectedCharIndex(null);
                      }}
                      onConfirm={() => {
                        if (selectedCharIndex !== null) {
                          handleRemoveCharacter(selectedCharIndex);
                        }
                      }}
                    />
                  )}
                </CharacterGrid>
              </AnimatedTabContent>
            </>
          ) : (
            <EmptyStateGrid>
              <EmptyState
                icon={<TbMapSearch />}
                title="저장된 캐릭터가 없어요"
                description="설화를 감상하고 캐릭터를 모아보세요"
                onIconClick={() => navigate("/search")}
                onDescriptionClick={() => navigate("/search")}
              />
            </EmptyStateGrid>
          )}
        </>
      )}
    </LibScreenContainer>
  );
}

const LibScreenContainer = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
  background-color: ${({ theme }) => theme.background};

  /* 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const LoginButton = styled.button`
  margin-top: 16px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const LibTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin: 0 16px;
`;

const LibTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 0;
  text-align: center;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.text : theme.textSecondary || "#666"};
  border-bottom: ${({ $active, theme }) =>
    $active ? `2px solid ${theme.text}` : "none"};
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
`;

const ChipContent = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  white-space: nowrap; /* 아이콘 + 텍스트 한 줄 유지 */
`;

const TaleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;

  & > * {
    width: 100%;
  }
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
`;

const EmptyStateGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  background-color: ${({ theme }) => theme.background};
`;

const slideFromRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const AnimatedTabContent = styled.div<{ direction: "left" | "right" }>`
  animation: ${({ direction }) =>
      direction === "right" ? slideFromRight : slideFromLeft}
    0.3s ease;
`;
