// components/FontFaceStyle.ts
import { createGlobalStyle } from "styled-components";

export const FontFaceStyle = createGlobalStyle<{
  font: { name: string; fontFile: string };
}>`
  @font-face {
    font-family: ${(props) => props.font.name};
    src: url(${(props) => props.font.fontFile}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;
