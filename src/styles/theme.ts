import { colors } from "../constants/colors";

export const lightTheme = {
  mode: "light",
  background: " #f6e7c1",
  cardBackground: " #fff",
  inputBackground: colors.BEIGE_500,
  sheetBackground: colors.BEIGE_500,
  taleBackground: colors.KHAKI_500,
  bottomTabsBackground: colors.BEIGE_500,

  taleTextBackground: " #fff",

  taleText: " #222222",

  text: " #3e3e3e",
  textSoft: " #666666",
  textPrimary: " #3e3e3e",
  textSecondary: " #b1a78f",

  primary: " #e4793f",
  primaryLight: " #eb9064",
  primaryHover: " #f59b6a",
  primaryDark: " #c76f34",
  primaryDisabled: "rgba(228,121,63,0.3)",
  border: " #b1a78f",

  iconBackground: " #e0dcf8",
  iconSecondary: " #d3d3d3",
  iconHover: " #aaa",
  linkHover: " #0056b3",

  buttonBackground: " #fff4e6",
  buttonSelectedBackground: " #ff8a3d",
  buttonText: " #000000",

  sheetHandleColor: colors.KHAKI_500,
  emblaDotBg: colors.KHAKI_500,
  emblaDotSelectedBg: " #e4793f",
};

export const darkTheme = {
  mode: "dark",
  background: "#1e1e1e",
  cardBackground: "#3e3e3e",
  inputBackground: "#2a2a2a",
  sheetBackground: "#2e2e2e",
  taleBackground: "#1e1e1e",
  bottomTabsBackground: "#3e3e3e",

  taleTextBackground: "#121212",
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
