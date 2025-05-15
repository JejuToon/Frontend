import tales from "../mocks/taleInfo";

const MY_TALES_KEY = "myTales";

// 전체 설화 목록 조회
export const fetchAllTales = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tales);
    }, 1000);
  });
};

// 설화 정보 상세 조회
export const fetchTaleById = async (id: number) => {
  return new Promise((resolve, reject) => {
    const tale = tales.find((t) => t.id === id);
    setTimeout(() => {
      tale ? resolve(tale) : reject("Tale not found");
    }, 1000);
  });
};

// 카테고리 별 설화 목록 조회
export const fetchTalesByCategory = async () => {
  return new Promise(() => {
    setTimeout(() => {}, 1000);
  });
};

// 현재 위치 기반 가까운 설화 목록 조회
export const fetchTalesByNearby = async () => {
  return;
};

// localStorage에 저장된 내 설화 목록 전체 조회
export const fetchAllMyTales = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    const stored = localStorage.getItem(MY_TALES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    setTimeout(() => resolve(parsed), 500);
  });
};

// 새로운 설화 저장
export const createMyTale = async (tale: any): Promise<void> => {
  return new Promise((resolve) => {
    const stored = localStorage.getItem(MY_TALES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    // 중복 방지 (id 기준)
    const exists = parsed.some((t: any) => t.id === tale.id);
    if (!exists) {
      parsed.push(tale);
      localStorage.setItem(MY_TALES_KEY, JSON.stringify(parsed));
    }

    setTimeout(() => resolve(), 500);
  });
};
