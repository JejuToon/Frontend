import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { getKakaoLoginUrl } from "../components/KakaoLogin";

export default function AuthScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      sendAuthorizationCode(authorizationCode);
    }
  }, []);

  const sendAuthorizationCode = async (authorizationCode: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/kakao?authorizationCode=${encodeURIComponent(
          authorizationCode
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      localStorage.setItem("accessToken", data.token.accessToken);
      navigate("/home");
    } catch (error) {
      setError("카카오 로그인 실패");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <LogoPlaceholder />
        <FormContainer onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <LoginButton type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </LoginButton>
        </FormContainer>

        <SocialContainer>
          <SocialButton onClick={handleKakaoLogin}>
            <img src="assets/icons/ico_login_kakao.png" alt="kakao" />
          </SocialButton>
          <SocialButton>
            <img src="assets/icons/ico_login_google.png" alt="google" />
          </SocialButton>
        </SocialContainer>

        <AuthLinks>
          <AuthLink href="#">아이디 찾기</AuthLink>
          <AuthLink href="#">비밀번호 찾기</AuthLink>
          <AuthLink href="#">회원가입</AuthLink>
        </AuthLinks>
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

const LogoPlaceholder = styled.div`
  width: 200px;
  height: 120px;
  background: ${({ theme }) => theme.cardBackground || "#e0e0e0"};
  border-radius: 8px;
  margin-bottom: 40px;
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border || "#ddd"};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.inputBackground || theme.background};
  color: ${({ theme }) => theme.text};
  box-sizing: border-box;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.buttonBackground || "#e2e8f0"};
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.buttonText || "#333"};
  cursor: pointer;
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 32px;
  margin: 32px 0 24px;
`;

const SocialButton = styled.button`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.background};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 32px;
`;

const AuthLink = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary || "#555"};
  text-decoration: none;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.875rem;
  margin: -10px 0 10px;
`;
