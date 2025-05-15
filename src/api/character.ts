import items from "../mocks/itemInfo";
import characters from "../mocks/characterInfo";

export const fetchCharItemById = async (id: number) => {
  return new Promise((resolve, reject) => {
    const charItem = items.find((t) => t.id === id);
    setTimeout(() => {
      charItem ? resolve(charItem) : reject("Item not found");
    }, 1000);
  });
};

//
export const createTaleCharacter = async () => {
  return;
};

// 사용자 캐릭터 조회
export const fetchAllMyCharacters = async (id: number) => {
  return new Promise((resolve, rejcet) => {
    const character = characters.find((t) => t.id === id);
    setTimeout(() => {
      character ? resolve(character) : rejcet("Tale not found");
    }, 1000);
  });
};

//
export const createMyCharacter = async () => {
  return;
};
