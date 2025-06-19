import axios from "axios";
import {
  TaleContent,
  UserTaleResponse,
  UserTaleListResponse,
} from "../types/tale";
import { useAuthStore } from "../stores/useAuthStore";

// 백엔드 baseURL
const api = axios.create({
  baseURL: "https://jeju-folktale.r-e.kr/api/v1",
});

export interface UserCharacter {
  userId: number;
  characterId: number;
  tale: TaleContent;
  imageUrl: string;
}

/**
 * @param userId
 * @returns
 * 저장된 모든 캐릭터 중 userId 기준 필터링
 */
/*
export const fetchUserCharacters = async (
  userId: number
): Promise<UserCharacter[]> => {
  const raw = localStorage.getItem("myCharcter-storage");
  const parsed: UserCharacter[] = raw ? JSON.parse(raw) : [];

  const userCharacters = parsed.filter((c) => c.userId === userId);
  return Promise.resolve(userCharacters);
};
*/

export const fetchUserCharacters = async (
  page: number
): Promise<UserTaleListResponse> => {
  try {
    const token = useAuthStore.getState().token?.accessToken;
    const response = await api.get<UserTaleListResponse>(
      "/member/me/folktale",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("사용자 설화 및 캐릭터 요청 실패:", error);
    throw error;
  }
};

export const fetchAllUserCharacters = async (): Promise<UserTaleResponse[]> => {
  try {
    const firstUserTale = await fetchUserCharacters(0);
    const totalPages = firstUserTale.meta.totalPage;
    let allUserTales: UserTaleResponse[] = [...firstUserTale.contents];

    for (let page = 1; page < totalPages; page++) {
      const pageData = await fetchUserCharacters(page);
      allUserTales = allUserTales.concat(pageData.contents);
    }

    return allUserTales;
  } catch (error) {
    console.error("전체 사용자 설화 및 캐릭터 요청 실패:", error);
    throw error;
  }
};

/** 사용자 캐릭터 추가 저장 */
/*
export const saveUserCharacter = async (
  character: UserCharacter
): Promise<void> => {
  const raw = localStorage.getItem("myCharcter-storage");
  const parsed: UserCharacter[] = raw ? JSON.parse(raw) : [];

  parsed.push(character);
  localStorage.setItem("myCharcter-storage", JSON.stringify(parsed));
  return Promise.resolve();
};
*/

interface SaveUserCharacterParams {
  memberFolktaleId: number;
  score: number | null;
  choiceIds: number[];
}

/**
 * 사용자 설화 저장하면서 이미지 생성 요청
 */
export const saveUserCharacter = async ({
  memberFolktaleId,
  score,
  choiceIds,
}: SaveUserCharacterParams): Promise<void> => {
  try {
    const token = useAuthStore.getState().token?.accessToken;
    if (!token) {
      throw new Error("Access token이 존재하지 않습니다.");
    }

    const userTaleInput = { score, choiceIds };

    await api.post(`/my-folktale/${memberFolktaleId}`, userTaleInput, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("사용자 설화 저장 및 이미지 생성 요청 실패:", error);
    throw error;
  }
};

/** 사용자 캐릭터 삭제 (userId + characterId 기준) */
export const deleteUserCharacter = async (
  userId: number,
  characterId: number
): Promise<void> => {
  const raw = localStorage.getItem("myCharcter-storage");
  const parsed: UserCharacter[] = raw ? JSON.parse(raw) : [];

  const updated = parsed.filter(
    (c) => !(c.userId === userId && c.characterId === characterId)
  );

  localStorage.setItem("myCharcter-storage", JSON.stringify(updated));
  return Promise.resolve();
};
