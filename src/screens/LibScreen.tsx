import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaEllipsisVertical } from "react-icons/fa6";
import styled from "styled-components";
import Header from "../components/Header";
import TaleCard from "../components/TaleCard";
import CharacterCard from "../components/CharacterCard";
import ConfirmModal from "../components/ConfirmModal";
import Tabs, { TabItem } from "../components/Tabs";
import EmptyState from "../components/EmptyState";
import { TbMapSearch } from "react-icons/tb";
import { RiLoginBoxLine } from "react-icons/ri";
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
];

export default function LibScreen() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [tab, setTab] = useState<"tale" | "character">("tale");
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
  const { characters, setSelectedCharacterId } = useCharacterStore();

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

  useEffect(() => {
    console.log(myChars);
  }, [myChars]);

  const handleRemoveTale = (index: number) => {
    const updatedTales = myTales.filter((_, i) => i !== index);
    setMyTales(updatedTales);
    localStorage.setItem("myTale-storage", JSON.stringify(updatedTales));
    setShowDeleteTaleModal(false);
  };

  const handleRemoveCharacter = (index: number) => {
    const target = characters[index];
    if (!target) return;

    useCharacterStore.getState().removeCharacter(target.taleId);

    setShowDeleteCharModal(false);
  };

  return (
    <LibScreenContainer>
      <Header left={<h1>설화</h1>} center={null} right={null} />

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
          <LibTabs>
            {TAB_ITEMS.map((item) => (
              <LibTab
                key={item.value}
                $active={tab === item.value}
                onClick={() => setTab(item.value as any)}
              >
                {item.label}
              </LibTab>
            ))}
          </LibTabs>

          {tab === "tale" ? (
            myTales.length > 0 ? (
              <TaleList>
                {myTales.map((t, index) => (
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
                      setSelectedTaleIndex(index);
                    }}
                  />
                ))}
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
            <CharacterGrid>
              {characters.map((c, idx) => (
                <CharacterCard
                  key={idx}
                  name={c.title || "이름 없음"}
                  avatarUrl={c.imageUrl || ""}
                  icon={<FaBars />}
                  onClickIcon={() => {
                    setShowDeleteCharModal(true);
                    setSelectedCharIndex(idx);
                  }}
                  onClick={() => handleCharacterClick(c.taleId)}
                />
              ))}
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
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
  background-color: ${({ theme }) => theme.background};
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
