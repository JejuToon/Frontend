import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --dot-bg: ${({ theme }) => theme.emblaDotBg};
    --dot-selected-bg: ${({ theme }) => theme.emblaDotSelectedBg};
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Arial', sans-serif;
    transition: all 0.3s ease;

    overflow-x: auto;
    -ms-overflow-style: none; /* IE/Edge */
    scrollbar-width: none;     /* Firefox */
  }

  body::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  #root {
    height: 100%;
    width: 100%;
  }
`;

export default GlobalStyle;
