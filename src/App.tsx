import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import LibScreen from "./screens/LibScreen";
import MyScreen from "./screens/MyScreen";
import AuthScreen from "./screens/AuthScreen";
import KakaoCallbackScreen from "./screens/KakaoCallbackScreen";
import TaleScreen from "./screens/TaleScreen";
import TaleReplayScreen from "./screens/TaleReplayScreen";
import TaleDetailScreen from "./screens/TaleDetailScreen";
import CameraScreen from "./screens/CameraScreen";
import BottomTabs from "./components/BottomTabs";
import { AccessControlProvider } from "./components/AccessControlProvider";
import { usePreviousLocation } from "./hooks/usePreviousLocation";
import { useAuthCheck } from "./hooks/useAuthCheck";

export default function App() {
  useAuthCheck();
  const location = useLocation();
  const prevLocation = usePreviousLocation();
  const isAuthRoute = location.pathname === "/auth";
  const isCallbackRoute = location.pathname.startsWith("/oauth/");

  const shouldHideTabs = ["/auth", "/tale", "/tale/play"].some((p) =>
    location.pathname.startsWith(p)
  );

  useEffect(() => {
    console.log("VITE_KAKAO_CLIENT_ID:", import.meta.env.VITE_KAKAO_CLIENT_ID);
    console.log(
      "VITE_KAKAO_REDIRECT_URI:",
      import.meta.env.VITE_KAKAO_REDIRECT_URI
    );
  }, []);

  return (
    <div>
      <AccessControlProvider>
        {/* 기본 라우트 화면 (탭 포함) */}
        <Routes
          location={isAuthRoute && !isCallbackRoute ? prevLocation : location}
        >
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/camera" element={<CameraScreen />} />
          <Route path="/lib" element={<LibScreen />} />
          <Route path="/my" element={<MyScreen />} />
          <Route path="/oauth/kakao" element={<KakaoCallbackScreen />} />
          <Route path="/tale" element={<TaleDetailScreen />} />
          <Route path="/tale/play" element={<TaleScreen />} />
          <Route path="/tale/replay" element={<TaleReplayScreen />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        {/* Auth 화면만 오버레이처럼 위에 애니메이션으로 렌더링 */}
        <AnimatePresence>
          {isAuthRoute && (
            <motion.div
              key="auth"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                backgroundColor: "#fff", // auth 화면이 완전히 덮도록
                zIndex: 999,
              }}
            >
              <AuthScreen />
            </motion.div>
          )}
        </AnimatePresence>

        {!shouldHideTabs && <BottomTabs />}
      </AccessControlProvider>
    </div>
  );
}
