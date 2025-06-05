//const CLIENT_ID = "5286ca90bb92ab86336d4edd295f85cf";
const CLIENT_ID = "388a5f94f1884d66b7654021db9f5c13";
const REDIRECT_URI = "https://2025-1-capstone.vercel.app/oauth/kakao";
//const REDIRECT_URI = "http://localhost:5173/oauth/kakao";

export const getKakaoLoginUrl = () => {
  return `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
};
