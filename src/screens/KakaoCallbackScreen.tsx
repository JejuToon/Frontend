import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function KakaoCallbackScreen() {
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      alert("인가 코드 없음");
      navigate("/auth");
      return;
    }

    const encodedCode = encodeURIComponent(code);

    console.log("인가 코드:", code);
    console.log("인코딩된 코드:", encodedCode);

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
        .then(async (res) => {
          const data = await res.json();
          console.log("응답 데이터:", data);

          if (!res.ok) {
            //console.error("서버 에러 상태코드:", res.status);
            throw new Error(data?.error || "서버 에러");
          }

          // login 내부에서 오류 날 경우 캐치
          try {
            login(data, data.token);
          } catch (e) {
            //console.error("login() 함수 내부 오류:", e);
            throw new Error("로그인 처리 중 에러");
          }

          navigate("/home");
        })
        .catch((err) => {
          alert("카카오 로그인 실패: " + err.message);
          navigate("/auth");
        });
    }
  }, []);

  return <p>카카오 로그인 처리 중입니다...</p>;
}
