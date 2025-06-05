import { create } from "zustand";

interface User {
  id: number;
  loginId: string;
  name: string;
  profileImageUrl: string;
}

interface Token {
  accessToken: string;
  refreshToken: string;
  grantType: string;
}

interface AuthState {
  user: User | null;
  token: Token | null;
  isLoggedIn: boolean;
  login: (user: User, token: Token) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  login: (user, token) => {
    set({
      user,
      token,
      isLoggedIn: true,
    });

    localStorage.setItem("accessToken", token.accessToken);
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });

    localStorage.removeItem("accessToken");
  },
}));
