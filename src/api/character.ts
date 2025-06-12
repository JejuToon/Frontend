import { TaleContent } from "../types/tale";

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
export const fetchUserCharacters = async (
  userId: number
): Promise<UserCharacter[]> => {
  const raw = localStorage.getItem("myCharcter-storage");
  const parsed: UserCharacter[] = raw ? JSON.parse(raw) : [];

  const userCharacters = parsed.filter((c) => c.userId === userId);
  return Promise.resolve(userCharacters);
};

/** 사용자 캐릭터 추가 저장 */
export const saveUserCharacter = async (
  character: UserCharacter
): Promise<void> => {
  const raw = localStorage.getItem("myCharcter-storage");
  const parsed: UserCharacter[] = raw ? JSON.parse(raw) : [];

  parsed.push(character);
  localStorage.setItem("myCharcter-storage", JSON.stringify(parsed));
  return Promise.resolve();
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
