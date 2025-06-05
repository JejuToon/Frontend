import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
