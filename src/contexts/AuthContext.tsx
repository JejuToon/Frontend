import React, { createContext, useState, useEffect, ReactNode } from "react";

// 사용자 정보 타입
interface User {
  id: number;
  name: string;
  email: string;
}

// AuthContext에서 사용할 인터페이스
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Context 생성 (초기값은 undefined)
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 컴포넌트가 마운트될 때 LocalStorage에서 토큰을 불러옴
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // 토큰으로 사용자 정보를 불러오는 API 호출
      // fetchUserInfo(storedToken).then(setUser).catch(()=>logout());
    }
  }, []);

  // 로그인 함수 (실제 프로젝트에서는 API 호출로 대체)
  const login = async (email: string, password: string) => {
    try {
      // 실제 API 호출 대신 가짜 API 함수 사용
      const response = await fakeLoginApi(email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", JSON.stringify(response.user));
    } catch (error) {
      console.error("Login failed: ", error);
      throw error;
    }
  };

  // 로그아웃 시 상태 초기화 및 localStorage 정리
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 가짜 API 함수 (실제 프로젝트에서는 백엔드 API와 연동)
interface FakeLoginResponse {
  token: string;
  user: User;
}

const fakeLoginApi = async (
  email: string,
  password: string
): Promise<FakeLoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //올바른 이메일과 비밀번호인지 확인
      if (email === "test@naver.com" && password === "p@ssw0rd") {
        resolve({
          token: "fake-token-00001",
          user: { id: 1, name: "test user", email },
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};
