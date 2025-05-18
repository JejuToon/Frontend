import axios from "axios";
import {
  Location,
  TaleContent,
  TaleListResponse,
  TaleDetailResponse,
  TaleResponse,
} from "../types/tale";

// 백엔드 baseURL
const api = axios.create({
  baseURL: "https://jeju-folktale.r-e.kr/api/v1",
});

/**
 * 전체 설화 목록을 페이징 처리 조회
 * @param page 페이지 번호 (0부터 시작)
 */
export const fetchAllTales = async (
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
