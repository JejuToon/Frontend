import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaArrowLeft } from "react-icons/fa6";
import Loader from "../components/Loader";
import { useUserInfoStore } from "../stores/useUserInfoStore";

const interestsOptions = ["개척담", "인물담", "연애담", "신앙담"];
const options1 = ["옵션1", "옵션2", "옵션3"];
const options2 = ["옵션4", "옵션5", "옵션6", "옵션7"];
const onboardingSteps = ["age", "interests", "options1", "options2", "result"];

export default function OnboardingRecommendForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const { hasCompletedRecommendForm, setHasCompletedRecommendForm } =
    useUserInfoStore();

  const [step, setStep] = useState(0);
  const [stepDirection, setStepDirection] = useState<"forward" | "backward">(
    "forward"
  );
  const [formData, setFormData] = useState({
    age: "",
    interests: [] as string[],
    options1: "",
    options2: "",
  });
  const [loading, setLoading] = useState(false);
  const [showProgressStep, setShowProgressStep] = useState(true);

  const next = () => {
    setStepDirection("forward");
    setStep((prev) => prev + 1);
  };
  const back = () => {
    setStepDirection("backward");
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const update = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    update(
      "interests",
      formData.interests.includes(interest)
        ? formData.interests.filter((i) => i !== interest)
        : [...formData.interests, interest]
    );
  };

  const handleSubmit = () => {
    setShowProgressStep(false);
    setLoading(true);
    setHasCompletedRecommendForm(true);
    setStep(4);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 3000);
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  return (
    <Container>
      {!loading && (
        <HeaderRow>
          <BackButton onClick={onClose}>
            <FaArrowLeft></FaArrowLeft>
          </BackButton>
          {step !== onboardingSteps.length - 2 && (
            <SkipButton onClick={handleSkip}>건너뛰기</SkipButton>
          )}
        </HeaderRow>
      )}

      {showProgressStep && (
        <ProgressBar>
          {onboardingSteps.slice(0, 4).map((_, i) => (
            <ProgressStep key={i} active={i <= step} />
          ))}
        </ProgressBar>
      )}

      <StepBox>
        {onboardingSteps[step] === "age" && (
          <SlideWrapper direction={stepDirection}>
            <Label>나이를 입력해주세요</Label>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => update("age", e.target.value)}
            />
          </SlideWrapper>
        )}

        {onboardingSteps[step] === "interests" && (
          <SlideWrapper direction={stepDirection}>
            <Label>관심 있는 주제를 골라주세요</Label>
            <ButtonGroup>
              {interestsOptions.map((option) => (
                <OptionButton
                  key={option}
                  selected={formData.interests.includes(option)}
                  onClick={() => toggleInterest(option)}
                >
                  {option}
                </OptionButton>
              ))}
            </ButtonGroup>
          </SlideWrapper>
        )}

        {onboardingSteps[step] === "options1" && (
          <SlideWrapper direction={stepDirection}>
            <Label>선택지</Label>
            <ButtonGroup>
              {options1.map((option) => (
                <OptionButton
                  key={option}
                  selected={formData.options1 === option}
                  onClick={() => update("options1", option)}
                >
                  {option}
                </OptionButton>
              ))}
            </ButtonGroup>
          </SlideWrapper>
        )}

        {onboardingSteps[step] === "options2" && (
          <SlideWrapper direction={stepDirection}>
            <Label>선택지~~</Label>
            <ButtonGroup>
              {options2.map((option) => (
                <OptionButton
                  key={option}
                  selected={formData.options2 === option}
                  onClick={() => update("options2", option)}
                >
                  {option}
                </OptionButton>
              ))}
            </ButtonGroup>
          </SlideWrapper>
        )}

        {onboardingSteps[step] === "result" && (
          <LoadArea>{loading && <Loader type="inline" />}</LoadArea>
        )}
      </StepBox>

      {step < onboardingSteps.length - 1 && (
        <NavFooter>
          <NavButton onClick={back} disabled={step === 0}>
            이전
          </NavButton>

          {step === 0 && (
            <NavButton onClick={next} disabled={!formData.age}>
              다음
            </NavButton>
          )}
          {step === 1 && (
            <NavButton
              onClick={next}
              disabled={formData.interests.length === 0}
            >
              다음
            </NavButton>
          )}
          {step === 2 && <NavButton onClick={next}>다음</NavButton>}
          {step === 3 && (
            <NavButton onClick={handleSubmit}>추천 받기</NavButton>
          )}
        </NavFooter>
      )}
    </Container>
  );
}

const SlideWrapper = styled.div<{ direction: "forward" | "backward" }>`
  width: 100%;
  animation: ${({ direction }) =>
      direction === "forward" ? slideInRight : slideInLeft}
    0.4s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  overflow-x: hidden;
`;

const StepBox = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  padding: 2rem;
  overflow: hidden;
  box-sizing: border-box;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: #999;
  cursor: pointer;
`;

const ProgressBar = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  padding: 16px;
`;

const ProgressStep = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ active }) => (active ? "#e4793f" : "#555")};
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1.2rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const OptionButton = styled.button<{ selected: boolean }>`
  padding: 10px 16px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: ${({ selected }) => (selected ? "#e4793f" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  cursor: pointer;
`;

const NavButton = styled.button`
  padding: 12px;
  background-color: #3e3e3e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  min-width: 120px;

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const NavFooter = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  padding: 1rem 2rem;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.background};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  margin: auto;
  border: 4px solid #ccc;
  border-top-color: #3e3e3e;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
`;
