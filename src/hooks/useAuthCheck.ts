// hooks/useAuthCheck.ts
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

function decodeJwt(token: string): { exp: number } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error("JWT decoding failed:", e);
    return null;
  }
}

export function useAuthCheck() {
  const { token, logout } = useAuthStore();

  useEffect(() => {
    if (!token?.accessToken) return;

    const decoded = decodeJwt(token.accessToken);
    if (!decoded) {
      logout();
      return;
    }

    const now = Math.floor(Date.now() / 1000); // seconds
    if (decoded.exp < now) {
      //console.log("Access token expired. Logging out...");
      logout();
    }
  }, [token, logout]);
}
