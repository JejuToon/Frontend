export const lightTheme = {
  mode: "light",
  background: "#ffffff",
  cardBackground: "#ffffff",
  inputBackground: "#fff",
  sheetBackground: "#fff",
  taleBackground: "#fff",

  surface: "#ffffff",
  card: "#f9f9f9",

  taleText: "#222222",

  text: "#000000",
  textSoft: "#666666",
  textPrimary: "#444",
  textSecondary: "#999",

  primary: "#e4793f",
  primaryHover: "#5c5c5c",
  primaryDark: "#7f3dff",
  border: "#e0e0e0",

  iconBackground: "#e0dcf8",
  iconSecondary: "#d3d3d3",
  iconHover: "#aaa",
  linkHover: "#0056b3",

  buttonBackground: "#e2e8f0",
  buttonText: "#000000",

  sheetHandleColor: "#ccc",
  emblaDotBg: "#b1a78f",
  emblaDotSelectedBg: "#e4793f",
};

export const darkTheme = {
  mode: "dark",
  background: "#1e1e1e",
  cardBackground: "#3e3e3e",
  inputBackground: "#2a2a2a",
  sheetBackground: "#2e2e2e",
  taleBackground: "#2e2e2e",

  surface: "#121212",
  card: "#1e1e1e",

  taleText: "#f1f1f1",

  text: "#ffffff",
  textSoft: "#aaaaaa",
  textPrimary: "#ddd",
  textSecondary: "#888",

  primary: "#e4793f",
  primaryHover: "#5c5c5c",
  primaryDark: "#b89cff",
  border: "#444444",

  iconBackground: "#3f3562",
  iconSecondary: "#555",
  iconHover: "#bbb",
  linkHover: "#66aaff",

  buttonBackground: "#3b3b3b",
  buttonText: "#ffffff",

  sheetHandleColor: "#555",
  emblaDotBg: "#555555",
  emblaDotSelectedBg: "#ffffff",
};

export type ThemeType = typeof lightTheme;
