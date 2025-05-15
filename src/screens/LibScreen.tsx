import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import TaleCard from "../components/TaleCard";
import CharacterCard from "../components/CharacterCard";
import Tabs, { TabItem } from "../components/Tabs";
import { useAuth } from "../hooks/useAuth";
import tales from "../mocks/taleInfo";
import characters from "../mocks/characterInfo";
import EmptyState from "../components/EmptyState";
import { TbMapSearch } from "react-icons/tb";

interface MarkerData {
  id: number;
  position: { lat: number; lng: number };
  category?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
}

interface CharacterCardProps {
  name: string;
  data: string;
  avatarUrl: string;
}

const TAB_ITEMS: TabItem[] = [
  { label: "설화", value: "tale" },
  { label: "캐릭터", value: "character" },
];

//const myTales: MarkerData[] = tales.slice(3, 5);
//localStorage.setItem("myTales", JSON.stringify(myTales));
const myCharacters: CharacterCardProps[] = characters.slice();
localStorage.setItem("myCharacters", JSON.stringify(myCharacters));

// 예시 선택지
interface Choice {
  text: string;
  next: number;
}

export default function LibScreen() {
  const { user } = useAuth();

  const [tab, setTab] = useState<"tale" | "character">("tale");
  const navigate = useNavigate();
  const [myTales, setMyTales] = useState<MarkerData[]>([]);

  const handleTaleClick = (tale: MarkerData) => {
    navigate("/setup", { state: { tale, from: "lib" } });
  };

  useEffect(() => {
    const stored = localStorage.getItem("myTales");
    const parsed = stored ? JSON.parse(stored) : [];
    setMyTales(parsed);
  }, []);

  return (
    <LibScreenContainer>
      <Header left={<h1>설화</h1>} center={null} right={null} />

      {!user ? (
        <LoginPrompt>
          <p>저장된 설화와 캐릭터를 보려면 로그인</p>
          <LoginButton onClick={() => navigate("/auth")}>
            로그인하기
          </LoginButton>
        </LoginPrompt>
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
                    thumbnailUrl={t.thumbnailUrl}
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
                  name={c.name}
                  data={c.data}
                  avatarUrl={c.avatarUrl}
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

// styled-components
const LibScreenContainer = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px; /* BottomTabs 높이 고려 */
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 48px;
  padding: 0 16px;
  color: #555;
`;

const LoginButton = styled.button`
  margin-top: 16px;
  padding: 12px 24px;
  background-color: #f5f4fa;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const LibTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
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
  color: ${({ $active }) => ($active ? "#000" : "#666")};
  border-bottom: ${({ $active }) => ($active ? "2px solid #000" : "none")};
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
`;
