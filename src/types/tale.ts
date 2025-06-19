export interface Location {
  latitude: number;
  longitude: number;
}

export interface TaleMarker {
  id: number;
  title: string;
  location: Location;
  categories: string[];
  description: string;
  score: number;
  thumbnail: string;
}

export interface TaleContent {
  id: number;
  title: string;
  location: Location[];
  categories: string[];
  description: string;
  score: number;
  thumbnail: string;
}

export interface TaleListMeta {
  listSize: number;
  totalPage: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface TaleListResponse {
  contents: TaleContent[];
  meta: TaleListMeta;
}

export interface UserTaleResponse {
  userTaleId: number;
  taleId: number;
  title: string;
  summary: string;
  characterImageUrl: string;
  score: number;
}

export interface UserTaleListResponse {
  contents: UserTaleResponse[];
  meta: TaleListMeta;
}

export interface TaleDetailResponse {
  id: number;
  title: string;
  location: Location[];
  categories: string[];
  description: string;
  summary: string;
  characterInfo: string;
  score: number;
  folktaleDetailIds: number[];
  thumbnail: string;
}

export interface TalePage {
  imageUrl: string;
  text: string;
  audioUrl: string;
  next?: string; // 단일 다음 페이지
  choices?: { id: number; text: string; next: string }[]; // 분기 선택지
}

export interface TaleResponse extends TaleListResponse {} // Nearby와 구조 같을 경우
