import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import TaleCard from "../components/TaleCard";
import CharacterCard from "../components/CharacterCard";
import Tabs, { TabItem } from "../components/Tabs";
import { useAuth } from "../hooks/useAuth";
import EmptyState from "../components/EmptyState";
import { TbMapSearch } from "react-icons/tb";
import { RiLoginBoxLine } from "react-icons/ri";

import { TaleContent } from "../types/tale";

interface CharacterCardProps {
  name: string;
  data: string;
  avatarUrl: string;
}

const TAB_ITEMS: TabItem[] = [
  { label: "설화", value: "tale" },
  { label: "캐릭터", value: "character" },
];

export default function LibScreen() {
  const { user } = useAuth();

  const [tab, setTab] = useState<"tale" | "character">("tale");
  const navigate = useNavigate();
  const [myTales, setMyTales] = useState<TaleContent[]>([]);
  const [myCharacters, setMyCharacters] = useState<CharacterCardProps[]>([]);

  const handleTaleClick = (tale: TaleContent) => {
    console.log("설화 리플레이");
  };

  useEffect(() => {
    try {
      const storedTale = localStorage.getItem("myTales");
      const parsedTale = storedTale ? JSON.parse(storedTale) : [];
      setMyTales(parsedTale);
    } catch (e) {
      console.error("myTales JSON 파싱 실패:", e);
      setMyTales([]);
    }

    try {
      const storedCharacter = localStorage.getItem("myCharacters");
      const parsedCharacter = storedCharacter
        ? JSON.parse(storedCharacter)
        : [];
      setMyCharacters(parsedCharacter);
    } catch (e) {
      console.error("myCharacters JSON 파싱 실패:", e);
      setMyCharacters([]);
    }
  }, []);

  return (
    <LibScreenContainer>
      <Header left={<h1>설화</h1>} center={null} right={null} />

      {!user ? (
        <EmptyStateGrid>
          <EmptyState
            icon={<RiLoginBoxLine />}
            title="연결된 정보가 없어요"
            description="로그인하면 이용할 수 있어요"
            linkUrl="/auth"
            navigateOnDescriptionClick={true}
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
                {myTales.map((t) => (
                  <TaleCard
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    description={t.description}
                    thumbnailUrl={t.thumbnail}
                    onClick={() => handleTaleClick(t)}
                  />
                ))}
              </TaleList>
            ) : (
              <EmptyStateGrid>
                <EmptyState
                  icon={<TbMapSearch />}
                  title="저장된 설화가 없어요"
                  description="설화를 감상해 보세요"
                  linkUrl="/search"
                  navigateOnDescriptionClick={true}
                />
              </EmptyStateGrid>
            )
          ) : myCharacters.length > 0 ? (
            <CharacterGrid>
              {myCharacters.map((c, idx) => (
                <CharacterCard
                  key={idx}
                  name={c.name || "이름 없음"}
                  data={c.data || "정보 없음"}
                  avatarUrl={c.avatarUrl || ""}
                />
              ))}
            </CharacterGrid>
          ) : (
            <EmptyStateGrid>
              <EmptyState
                icon={<TbMapSearch />}
                title="저장된 캐릭터가 없어요"
                description="설화를 감상하고 캐릭터를 만들어 보세요"
                linkUrl="/search"
                navigateOnDescriptionClick={true}
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

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 48px;
  padding: 0 16px;
  color: ${({ theme }) => theme.textSecondary || "#555"};
`;

const LoginButton = styled.button`
  margin-top: 16px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.buttonBackground || "#e2e8f0"};
  color: ${({ theme }) => theme.buttonText || "black"};
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const LibTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#ddd"};
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
  padding: 150px;
  background-color: ${({ theme }) => theme.background};
`;
