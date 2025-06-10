import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import styled from "styled-components";
import Header from "../components/Header";
import TooltipOverlay from "../components/ToolTipOverlay";
import TTSSettings from "../components/TTSSettings";
import ConfirmModal from "../components/ConfirmModal";
import ThemeToggle from "../components/ThemeToggle";
import { useAuthStore } from "../stores/useAuthStore";
import { useAllTalesStore } from "../stores/useAllTalesStore";
import { useUserInfoStore } from "../stores/useUserInfoStore";
import { useRecommendationStore } from "../stores/useRecommendationStore";
import { computeUserPreferenceWeights } from "../utils/computeWeights";
import {
  computePersonalizedScore,
  getRecommendedTales,
} from "../utils/computeScore";

export default function MyScreen() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();

  const { resetSkipTaleSetup } = useUserInfoStore();

  const { allTales, fetchAllTalesData } = useAllTalesStore();
  const {
    onboardingInput,
    clearOnboardingInput,
    setRecommendedTales,
    setWeights,
  } = useRecommendationStore();

  const [showRecModal, setShowRecModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (allTales.length === 0) {
      fetchAllTalesData(); // 전체 설화 목록 불러오기
    }
  }, []);

  return (
    <MyScreenContainer>
      <Header left={<h1>정보</h1>} center={null} right={null} />

      <UserInfoSection>
        {user?.profileImageUrl && <Avatar src={user.profileImageUrl} />}
        <UserText>{user?.name || "로그인되지 않음"}</UserText>
      </UserInfoSection>

      <ButtonWrapper>
        <LoginButton onClick={isLoggedIn ? logout : () => navigate("/auth")}>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </LoginButton>
      </ButtonWrapper>

      <Section>
        <SectionHeader />
        <MyList>
          <MyListItem>
            <ItemText>테마</ItemText>
            <ThemeToggle variant="medium" />
          </MyListItem>

          <MyListItem2>
            {/*<TooltipOverlay
              message="다양한 TTS를 들어보려면 눌러보세요!"
              topOffset="-40px;"
            />*/}
            <TTSSettings type="detail" expanded={false} />
          </MyListItem2>

          <MyListItem onClick={() => setShowRecModal(true)}>
            <ItemText>맞춤 추천 초기화</ItemText>
            <FaAngleRight />
          </MyListItem>

          <MyListItem onClick={() => setShowSetupModal(true)}>
            <ItemText>설화 설정 초기화</ItemText>
            <FaAngleRight />
          </MyListItem>

          {/* 테스트 용 
          <MyListItem
            onClick={() => {
              const stored = JSON.parse(
                localStorage.getItem("myTale-storage") || "[]"
              );

              if (onboardingInput) {
                const weights = computeUserPreferenceWeights(
                  onboardingInput,
                  stored
                );

                console.log(weights);

                const top5Tales = getRecommendedTales(allTales, weights, 5);

                setWeights(weights);
                setRecommendedTales(top5Tales);

                console.log(top5Tales);
              }
            }}
          >
            <ItemText>맞춤 설화 추천 테스트</ItemText>
            <FaAngleRight />
          </MyListItem>
          */}

          {showRecModal && (
            <ConfirmModal
              mainTitle="정말 초기화할까요?"
              subTitle="초기화 시 추천 설정 정보가 사라집니다."
              onClose={() => setShowRecModal(false)}
              onConfirm={() => {
                clearOnboardingInput();
                setShowRecModal(false);
              }}
            />
          )}

          {showSetupModal && (
            <ConfirmModal
              mainTitle="정말 초기화할까요?"
              subTitle="초기화 시 설화 설정 정보가 사라집니다."
              onClose={() => setShowSetupModal(false)}
              onConfirm={() => {
                resetSkipTaleSetup();
                setShowSetupModal(false);
              }}
            />
          )}
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
  transition: background-color 0.3s ease, opacity 0.3s ease;
  background-color: ${({ theme }) => theme.background};
`;

const UserInfoSection = styled.section`
  margin: 24px auto 8px;
  text-align: center;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin-bottom: 12px;
`;

const UserText = styled.h2`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
  margin: 0;
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
  margin: 16px;
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

const Section = styled.section``;

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
`;

const MyListItem2 = styled.div`
  position: relative;
  padding: 16px;
`;

const ItemText = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;
