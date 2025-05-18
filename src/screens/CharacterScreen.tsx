import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa6";
import Tabs, { TabItem } from "../components/Tabs";
import ItemCard from "../components/ItemCard";
import Header from "../components/Header";
import { useStoryStore } from "../stores/useStoryStore";

const char0 = "/assets/images/character/char0.png";
const hat1 = "/assets/images/item/hat1.png";
const hat2 = "/assets/images/item/hat2.png";

const TAB_ITEMS: TabItem[] = [
  { label: "모자", value: "item1" },
  { label: "안경", value: "item2" },
  { label: "귀걸이", value: "item3" },
  { label: "목걸이", value: "item4" },
];

interface DIYItem {
  id: number;
  title: string;
  imageUrl: string;
}

const DIY_DATA: Record<string, DIYItem[]> = {
  item1: [
    { id: 1, title: "", imageUrl: hat1 },
    { id: 2, title: "", imageUrl: hat2 },
  ],
};

export default function CharacterScreen() {
  const { setCharacterImage } = useStoryStore();
  const { selectedTale } = useStoryStore();

  const [tab, setTab] = useState<string>(TAB_ITEMS[0].value);
  const [selected, setSelected] = useState<Record<string, number | null>>({});
  const navigate = useNavigate();
  const items = DIY_DATA[tab] || [];

  const handleButtonClick = () => {
    setCharacterImage(char0);
    navigate("/tale/setup");
  };

  return (
    <Screen>
      <StickyHeader>
        <Header
          left={<FaArrowLeft onClick={() => navigate(-1)} />}
          center={<h1>캐릭터</h1>}
        />
      </StickyHeader>

      <StaticArea>
        <ImageContainer>
          <img src={char0} alt="캐릭터" />
        </ImageContainer>
        <Tabs items={TAB_ITEMS} current={tab} onChange={setTab} />
      </StaticArea>

      <ScrollArea>
        <Grid>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              {...item}
              isSelected={selected[tab] === item.id}
              onClick={() =>
                setSelected((prev) => ({
                  ...prev,
                  [tab]: prev[tab] === item.id ? null : item.id,
                }))
              }
            />
          ))}
        </Grid>
      </ScrollArea>

      <Footer>
        <NextButton onClick={handleButtonClick}>다음</NextButton>
      </Footer>
    </Screen>
  );
}

// styled-components
const Screen = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: white;
`;

const StaticArea = styled.div`
  flex: 0 0 auto;
  padding: 8px;
  box-sizing: border-box;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;

  img {
    width: 300px;
    height: 300px;
    object-fit: contain;
  }
`;

const ScrollArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0 16px;
  box-sizing: border-box;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  margin-top: 5px;
  flex-wrap: wrap;
`;

const Footer = styled.footer`
  flex: 0 0 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const NextButton = styled.button`
  width: 70%;
  height: 44px;
  background: #4b5563;
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 22px;
  cursor: pointer;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);

  &:active {
    opacity: 0.8;
  }
`;
