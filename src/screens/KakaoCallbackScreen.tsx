import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function KakaoCallbackScreen() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      fetch(
        `https://jeju-folktale.r-e.kr/api/v1/auth/kakao?authorizationCode=${encodeURIComponent(
          code
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          login(data, data.token);
          navigate("/home");
        })
        .catch(() => {
          alert("카카오 로그인 실패");
          navigate("/auth");
        });
    }
  }, []);

  return <p>카카오 로그인 처리 중입니다...</p>;
}
