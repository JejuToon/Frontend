import React, { useState, useEffect, useMemo } from "react";
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
import ChipGroup from "../components/ChipGroup";
import FloatingMenu from "../components/FloatingMenu";
import Tabs, { TabItem } from "../components/Tabs";
import EmptyState from "../components/EmptyState";
import { TbMapSearch } from "react-icons/tb";
import { RiLoginBoxLine } from "react-icons/ri";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useCharacterStore } from "../stores/useCharacterStore";
import { useReplayTaleStore } from "../stores/useReplayTaleStore";
import { useAuthStore } from "../stores/useAuthStore";

import { TaleContent } from "../types/tale";

import { fetchUserTales } from "../api/tale";
import { fetchUserCharacters, deleteUserCharacter } from "../api/character";

interface UserTaleContent {
  storyId: string[];
  userId: number;
  tale: TaleContent;
}

interface UserCharacter {
  userId: number;
  characterId: number;
  tale: TaleContent;
  imageUrl: string;
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
  const [myTales, setMyTales] = useState<UserTaleContent[]>([]);
  const [myCharacters, setMyCharacters] = useState<UserCharacter[]>([]);
  const [showDeleteTaleModal, setShowDeleteTaleModal] = useState(false);
  const [showDeleteCharModal, setShowDeleteCharModal] = useState(false);
  const [selectedTaleIndex, setSelectedTaleIndex] = useState<number | null>(
    null
  );
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<
    number | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [floatingMenuPos, setFloatingMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { setSelectedMarker } = useSelectedMarkerStore();

  // 방향 계산
  const animationDirection: "left" | "right" =
    prevTab === "tale" && tab === "character"
      ? "right"
      : prevTab === "character" && tab === "tale"
      ? "left"
      : "right";

  const handleTaleClick = (userTale: UserTaleContent) => {
    useReplayTaleStore.getState().setReplayTale(userTale);
    navigate("/tale/replay");
  };

  const handleCharacterClick = (taleId: number) => {
    setSelectedCharacterIndex(taleId);
    navigate("/camera", { state: { selectedCharacterId: taleId } });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const tales = await fetchUserTales(user.id);
        const chars = await fetchUserCharacters(user.id);
        setMyTales(tales);
        setMyCharacters(chars);
      } catch (e) {
        console.error("사용자 데이터 불러오기 실패:", e);
      }
    };

    fetchData();
  }, [user]);

  const handleRemoveTale = (index: number) => {
    const updatedTales = myTales.filter((_, i) => i !== index);
    setMyTales(updatedTales);
    localStorage.setItem("myTale-storage", JSON.stringify(updatedTales));
    setShowDeleteTaleModal(false);
  };

  const handleRemoveCharacter = async (index: number) => {
    const target = myCharacters[index];
    if (!target) return;

    await deleteUserCharacter(target.userId, target.characterId);
    const updated = myCharacters.filter((_, i) => i !== index);
    setMyCharacters(updated);

    setShowDeleteCharModal(false);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const filteredTales = useMemo(
    () =>
      selectedCategory
        ? myTales.filter((t) => t.tale.categories?.includes(selectedCategory))
        : myTales,
    [myTales, selectedCategory]
  );

  const filteredCharacters = useMemo(
    () =>
      selectedCategory
        ? myCharacters.filter((c) =>
            c.tale.categories?.includes(selectedCategory)
          )
        : myCharacters,
    [myCharacters, selectedCategory]
  );

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
      <Tabs<TabType>
        items={TAB_ITEMS}
        active={tab}
        onChange={(next) => {
          setPrevTab(tab);
          setTab(next);
        }}
      />
      {user && (
        <ChipGroup
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />
      )}

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
          {tab === "tale" ? (
            myTales.length > 0 ? (
              <>
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
          ) : myCharacters.length > 0 ? (
            <>
              <AnimatedTabContent key={tab} direction={animationDirection}>
                <CharacterGrid>
                  {filteredCharacters.map((c) => {
                    const originalIndex = myCharacters.findIndex(
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
                          setSelectedCharacterIndex(originalIndex);
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
                        setSelectedCharacterIndex(null);
                      }}
                      onConfirm={() => {
                        if (selectedCharacterIndex !== null) {
                          handleRemoveCharacter(selectedCharacterIndex);
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

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
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
