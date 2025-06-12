import React from "react";
import styled from "styled-components";
import { FaPersonHiking, FaUser, FaHeart, FaCross } from "react-icons/fa6";
import Chip from "./Chip";

const allCategories = ["개척담", "인물담", "연애담", "신앙담"];
const categoriesIcons = [FaPersonHiking, FaUser, FaHeart, FaCross];

interface ChipGroupProps {
  selected: string | null;
  setSelected: (category: string | null) => void;
}

export default function ChipGroup({ selected, setSelected }: ChipGroupProps) {
  const handleToggle = (category: string) => {
    setSelected(selected === category ? null : category);
  };

  return (
    <ChipContainer>
      {allCategories.map((cat, index) => {
        const Icon = categoriesIcons[index];
        return (
          <Chip
            key={cat}
            selected={selected === cat}
            onToggle={() => handleToggle(cat)}
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
  );
}

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
  white-space: nowrap;
`;
