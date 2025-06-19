import axios from "axios";
import {
  Location,
  TaleContent,
  TaleListResponse,
  TaleDetailResponse,
  TaleResponse,
} from "../types/tale";
import { useAuthStore } from "../stores/useAuthStore";

// 백엔드 baseURL
const api = axios.create({
  baseURL: "https://jeju-folktale.r-e.kr/api/v1",
});

/**
 * 전체 설화 목록을 페이징 처리 조회
 * @param page 페이지 번호 (0부터 시작)
 */
export const fetchAllTalesPage = async (
  page: number
): Promise<TaleListResponse> => {
  try {
    const response = await api.get<TaleListResponse>("/folktale", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("전체 설화 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 전체 설화 목록 (전체 페이지) – 누적
 * @returns 모든 설화 리스트
 */
export const fetchAllTales = async (): Promise<TaleContent[]> => {
  try {
    const firstPage = await fetchAllTalesPage(0);
    const totalPages = firstPage.meta.totalPage;
    let allTales: TaleContent[] = [...firstPage.contents];

    for (let page = 1; page < totalPages; page++) {
      const pageData = await fetchAllTalesPage(page);
      allTales = allTales.concat(pageData.contents);
    }

    return allTales;
  } catch (error) {
    console.error("전체 설화 전체 페이지 불러오기 실패:", error);
    throw error;
  }
};

/**
 * 특정 설화 ID로 상세 정보 조회
 * @param folktaleId
 * @returns TaleDetailResponse
 */
export const fetchTaleDetail = async (
  folktaleId: number
): Promise<TaleDetailResponse> => {
  try {
    const response = await api.get<TaleDetailResponse>(
      `/folktale/${folktaleId}`
    );
    return response.data;
  } catch (error) {
    console.error(`설화 상세 정보(${folktaleId}) 조회 실패:`, error);
    throw error;
  }
};

/**
 * 특정 카테고리의 설화 목록을 페이지 단위로 조회
 * @param category "인물담" | "개척담" | "연애담" | "신앙담"
 * @param page 페이지 번호 (0부터 시작)
 */
export const fetchTalesByCategory = async (
  category: string,
  page: number
): Promise<TaleListResponse> => {
  try {
    const response = await api.get<TaleListResponse>("/folktale", {
      params: {
        category,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`카테고리(${category}) 설화 목록 조회 실패:`, error);
    throw error;
  }
};

/**
 * 현재 위치 기반 가까운 설화 목록 조회
 * @param lat 위도
 * @param lng 경도
 * @returns 설화 목록과 메타 정보
 */
export const fetchNearbyTales = async (
  lat: number,
  long: number
): Promise<TaleListResponse> => {
  try {
    const response = await api.get<TaleListResponse>("/folktale/nearby", {
      params: { lat, long },
    });
    return response.data;
  } catch (error) {
    console.error("위치 기반 설화 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 설화 제목으로 설화 리스트를 검색
 * @param title 검색할 설화 제목
 * @param page 페이지 번호 (0부터 시작)
 * @returns TaleListResponse
 */
export async function searchTalesByTitle(
  title: string,
  page: number
): Promise<TaleListResponse> {
  const response = await api.get<TaleListResponse>("/folktale", {
    params: {
      title,
      page,
    },
  });
  return response.data;
}

export const createMemberFolktale = async (
  folktaleId: number
): Promise<number> => {
  const token = useAuthStore.getState().token?.accessToken;
  if (!token) throw new Error("Access token이 없습니다.");

  const response = await api.post(`/folktale/${folktaleId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.id; // memberFolktaleId
};

// 저장 타입 정의
export interface UserTaleData {
  userId: number;
  tale: TaleContent;
  storyId: string[];
  userRating: number | null;
  completedAt: string;
}

/**
 * 사용자 설화 저장
 * @param userTale 사용자 ID와 설화 정보, 완료한 페이지, 평점 등
 */
export const saveUserTale = async (userTale: UserTaleData): Promise<void> => {
  const raw = localStorage.getItem("myTale-storage");
  const parsed: UserTaleData[] = raw ? JSON.parse(raw) : [];

  parsed.push(userTale);
  localStorage.setItem("myTale-storage", JSON.stringify(parsed));

  return Promise.resolve();

  /*
  try {
    const response = await api.post("", userTale);
    return response.data;
  } catch (error) {
    console.error("사용자 설화 저장 실패:", error);
    throw error;
  }
  */
};

/**
 * 사용자 설화 요청
 * 사용자 설화 불러오기 (userId 기준 필터링)
 */
export const fetchUserTales = async (
  userId: number
): Promise<UserTaleData[]> => {
  const raw = localStorage.getItem("myTale-storage");
  const parsed: UserTaleData[] = raw ? JSON.parse(raw) : [];

  const userTales = parsed.filter((item) => item.userId === userId);
  return Promise.resolve(userTales);
};
