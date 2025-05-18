export interface Location {
  latitude: number;
  longitude: number;
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

export interface TaleResponse extends TaleListResponse {} // Nearby와 구조 같을 경우
