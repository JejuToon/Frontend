import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    mode: string;
    background: string;
    cardBackground: string;
    inputBackground: string;
    sheetBackground: string;
    taleBackground: string;
    bottomTabsBackground: string;
    taleTextBackground: string;
    taleText: string;
    text: string;
    textSoft: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    primaryLight: string;
    primaryHover: string;
    primaryDark: string;
    primaryDisabled: string;
    border: string;
    iconBackground: string;
    iconSecondary: string;
    iconHover: string;
    linkHover: string;
    buttonBackground: string;
    buttonSelectedBackground: string;
    buttonText: string;
    sheetHandleColor: string;
    emblaDotBg: string;
    emblaDotSelectedBg: string;
  }
}
