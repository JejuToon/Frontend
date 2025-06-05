const CLIENT_ID = "5286ca90bb92ab86336d4edd295f85cf";
const REDIRECT_URI = "https://jeju-folktale.r-e.kr/auth/kakao";

export const getKakaoLoginUrl = () => {
  return `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
};
