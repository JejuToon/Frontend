import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
import { useThemeStore } from "./stores/useThemeStore";

import { AuthProvider } from "./contexts/AuthContext";

// 커스텀 Hook처럼 한 번 theme을 가져와서 적용
function ThemedApp() {
  const mode = useThemeStore((state) => state.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
