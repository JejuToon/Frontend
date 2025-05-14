import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";

export default function MyScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSettings = () => console.log("설정 클릭");

  return (
    <MyScreenContainer>
      <Header
        left={<h1>정보</h1>}
        center={null}
        right={<span onClick={handleSettings}>⚙️</span>}
      />

      <ButtonWrapper>
        <LoginButton onClick={user ? logout : () => navigate("/auth")}>
          {user ? "로그아웃" : "로그인"}
        </LoginButton>
      </ButtonWrapper>

      <MyList>
        {[...Array(9)].map((_, i) => (
          <MyListItem key={i}>
            <ItemText>설정 {i}</ItemText>
          </MyListItem>
        ))}
      </MyList>
    </MyScreenContainer>
  );
}

// styled-components
const MyScreenContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 60px; /* BottomTabs 높이 고려 */
`;

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
`;

const LoginButton = styled.button`
  width: 100%;
  align-self: center; // 수직 방향에서 가운데 정렬
  padding: 14px 0;
  margin: 6px;
  background: #f5f4fa;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const AvatarPlaceholder = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background: rgba(128, 0, 128, 0.2);
`;

const MyList = styled.ul`
  list-style: none;
  margin: 0;
`;

const MyListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
`;

const ItemText = styled.span`
  padding-left: 16px;
  font-size: 20px;
  color: #333;
`;
