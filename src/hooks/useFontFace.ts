// hooks/useFontFace.ts
import { createGlobalStyle } from "styled-components";

export function useFontFace(
  font: { name: string; fontFile: string; style?: string } | undefined
) {
  if (!font) return null;

  return createGlobalStyle`
    @font-face {
      font-family: '${font.name}';
      src: url(${font.fontFile}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;
}
