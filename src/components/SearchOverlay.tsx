import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaChevronLeft, FaXmark } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import TaleCard from "./TaleCard";
import CustomButton from "../components/CustomButton";
import { useSearchHistoryStore } from "../stores/useSearchHistoryStore";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useStoryStore } from "../stores/useStoryStore";
import { searchTalesByTitle } from "../api/tale";
import { TaleContent } from "../types/tale";

import Loader from "./Loader";

interface SearchOverlayProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onClose: () => void;
}

export default function SearchOverlay({
  keyword,
  onKeywordChange,
  onClose,
}: SearchOverlayProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<TaleContent[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedKeyword, setSearchedKeyword] = useState<string>("");

  const { setTaleId } = useStoryStore();
  const { history, addKeyword, removeKeyword, clearHistory } =
    useSearchHistoryStore();
  const { setSelectedMarker } = useSelectedMarkerStore();

  // 애니메이션 시작
  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  // 자동 포커스
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* 디바운스 검색 
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const res = await searchTalesByTitle(keyword, 0);
        setSearchResults(res.contents);
      } catch (err) {
        console.error("검색 실패:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [keyword]);
  */

  const fetchSearchResults = async (inputKeyword = keyword) => {
    if (!inputKeyword) return;

    setSearchLoading(true);
    setSearchedKeyword(inputKeyword);
    try {
      const res = await searchTalesByTitle(inputKeyword, 0);
      setSearchResults(res.contents);
    } catch (err) {
      console.error("검색 실패:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    inputRef.current?.blur();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSearchResults();
      addKeyword(keyword);
    }
  };

  const handleTaleClick = (id: number) => {
    setTaleId(id);
    navigate("/tale");
  };

  const handleSelect = (item: string) => {
    onKeywordChange(item);
    inputRef.current?.focus();
    fetchSearchResults(item);
  };

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
    onClose();
  };

  return (
    <Overlay open={open}>
      <SearchHeader>
        <SearchBox>
          <CloseBtn>
            <FaChevronLeft onClick={handleClose} />
          </CloseBtn>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="설화 검색"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {keyword && (
            <ClearInputBtn onClick={() => onKeywordChange("")}>×</ClearInputBtn>
          )}
        </SearchBox>
      </SearchHeader>
      <Results>
        {keyword.trim() === "" ? (
          history.length > 0 && (
            <HistorySection>
              <h4>최근 검색어</h4>
              <ul>
                {history.map((item, index) => (
                  <li key={index}>
                    <HistoryItem onClick={() => handleSelect(item)}>
                      {item}
                    </HistoryItem>
                    <RemoveBtn onClick={() => removeKeyword(item)}>
                      <FaXmark />
                    </RemoveBtn>
                  </li>
                ))}
              </ul>
            </HistorySection>
          )
        ) : searchedKeyword !== "" ? (
          // 검색어 입력, 검색 완료된 상태
          <div>
            <h4>"{searchedKeyword}"에 대한 검색 결과</h4>
            {searchLoading ? (
              <Loader type="inline" description="설화를 찾는중..." />
            ) : searchResults.length > 0 ? (
              <div>
                {searchResults.map((t) => (
                  <li
                    key={t.id}
                    style={{ marginBottom: "12px", listStyle: "none" }}
                  >
                    <TaleCard
                      id={t.id}
                      title={t.title}
                      description={t.description || "설명이 없습니다"}
                      thumbnailUrl={t.thumbnail || ""}
                      onClick={() => handleTaleClick(t.id)}
                    >
                      <CustomButton
                        label="위치 보기"
                        icon={<IoLocationSharp />}
                        size="small"
                        variant="filled"
                        onClick={() => handleViewMap(t)}
                      />
                    </TaleCard>
                  </li>
                ))}
              </div>
            ) : (
              <p>“{searchedKeyword}”에 대한 결과가 없습니다.</p>
            )}
          </div>
        ) : null}
      </Results>
    </Overlay>
  );
}

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.background};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: scale(${({ open }) => (open ? 1 : 0.95)});
  transition: opacity 0.2s ease, transform 0.2s ease;
`;

const SearchHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 10;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.inputBackground || "#f3eefc"};
  padding: 12px 16px;
  margin: 20px;
  border-radius: 999px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  outline: none;
`;

const ClearInputBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #aaa;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;

  &:hover {
    color: #555;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary || "#555"};
`;

const Results = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 70px 16px 16px 16px;
`;

const HistorySection = styled.div`
  padding: 0 8px;
  ul {
    list-style: none;
    padding: 0;
    margin: 8px 0 0 0;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryItem = styled.button`
  background: none;
  border: none;
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  text-align: left;
`;

const RemoveBtn = styled.button`
  font-size: 12px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
`;
