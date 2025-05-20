import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";

export default function MyScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <MyScreenContainer>
      <Header left={<h1>정보</h1>} center={null} right={null} />

      <ButtonWrapper>
        <LoginButton onClick={user ? logout : () => navigate("/auth")}>
          {user ? "로그아웃" : "로그인"}
        </LoginButton>
      </ButtonWrapper>

      <Section>
        <SectionHeader></SectionHeader>
        <MyList>
          <MyListItem>
            <ItemText>다크 모드</ItemText>
            <ThemeToggle />
          </MyListItem>
        </MyList>
      </Section>

      <Section>
        <SectionHeader></SectionHeader>
        <MyList>
          {[...Array(3)].map((_, i) => (
            <MyListItem key={i}>
              <ItemText>설정 {i}</ItemText>
            </MyListItem>
          ))}
        </MyList>
      </Section>

      <Section>
        <SectionHeader></SectionHeader>
        <MyList>
          {[...Array(3)].map((_, i) => (
            <MyListItem key={i}>
              <ItemText>설정 {i}</ItemText>
            </MyListItem>
          ))}
        </MyList>
      </Section>
    </MyScreenContainer>
  );
}

const MyScreenContainer = styled.main`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding-bottom: 60px;
  transition: opacity 0.6s ease;
  background-color: ${({ theme }) => theme.background};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  text-aling: center;
`;

const LoginButton = styled.button`
  width: 90%;
  align-self: center;
  padding: 14px 0;
  margin: 6px;
  background: ${({ theme }) => theme.buttonBackground || "#e2e8f0"};
  color: ${({ theme }) => theme.buttonText || "black"};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Section = styled.section`
  border-bottom: 8px solid ${({ theme }) => theme.border || "#f3e7c5"};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  h3 {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`;

const MyList = styled.div`
  list-style: none;
  margin: 0;
`;

const MyListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#eee"};
`;

const ItemText = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text || "#333"};
`;
