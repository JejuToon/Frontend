import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import LibScreen from "./screens/LibScreen";
import MyScreen from "./screens/MyScreen";
import AuthScreen from "./screens/AuthScreen";
import TaleScreen from "./screens/TaleScreen";
import BottomTabs from "./components/BottomTabs";
import TaleSetupScreen from "./screens/TaleSetupScreen";
import TaleDetailScreen from "./screens/TaleDetailScreen";
import CameraScreen from "./screens/CameraScreen";

export default function App() {
  const location = useLocation();
  const hideTabPaths = [
    "/auth",
    "/tale",
    "/tale/play",
    "/tale/character",
    "/tale/setup",
  ];
  const shouldHideTabs = hideTabPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div>
      <Routes>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/camera" element={<CameraScreen />} />
        <Route path="/lib" element={<LibScreen />} />
        <Route path="/my" element={<MyScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/tale" element={<TaleDetailScreen />} />
        <Route path="/tale/play" element={<TaleScreen />} />
        <Route path="/tale/setup" element={<TaleSetupScreen />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {!shouldHideTabs && <BottomTabs />}
    </div>
  );
}
