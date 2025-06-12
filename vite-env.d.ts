/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_KAKAO_CLIENT_ID: string;
  readonly VITE_KAKAO_REDIRECT_URI: string;
  // 여기에 사용하는 다른 환경변수도 추가하세요.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
