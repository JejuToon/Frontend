import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { getKakaoLoginUrl } from "../components/KakaoLogin";

export default function AuthScreen() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <AuthScreenWrapper>
      <Header
        left={
          <FaArrowLeft
            onClick={() => navigate("/my")}
            style={{ cursor: "pointer" }}
          />
        }
        center={null}
        right={null}
      />

      <AuthContainer>
        <ImageContainer>
          <LogoImage src="/icons/icon.png" alt="main logo" />
          <LogoImage src="/icons/title-icon.png" alt="main logo" />
        </ImageContainer>

        <SocialContainer>
          <SocialButton>
            <img src="assets/icons/ico_login_google.png" alt="login logo" />
            Google로 계속하기
          </SocialButton>

          <SocialButton
            bgColor="#fddc3f"
            fontColor="#000"
            onClick={handleKakaoLogin}
          >
            <img src="assets/icons/ico_login_kakao.png" alt="login logo" />
            카카오로 계속하기
          </SocialButton>
        </SocialContainer>
      </AuthContainer>
    </AuthScreenWrapper>
  );
}

const AuthScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

const AuthContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  box-sizing: border-box;
`;

const ImageContainer = styled.div`
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const LogoImage = styled.img`
  width: 200px;
  height: 120px;
  object-fit: contain;
`;

const SocialContainer = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 48px;
  width: 100%;
  max-width: 300px;
`;

const SocialButton = styled.button<{
  bgColor?: string;
  fontColor?: string;
  border?: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  color: ${({ fontColor }) => fontColor || "#000"};
  border: ${({ border }) => (border ? "1px solid #000" : "none")};
  transition: background-color 0.2s;

  img {
    position: absolute;
    left: 16px;
    width: 25px;
    height: 25px;
    object-fit: contain;
  }

  &:hover {
    opacity: 0.85;
  }
`;
