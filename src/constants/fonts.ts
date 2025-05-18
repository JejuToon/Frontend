import koPub from "../assets/fonts/KoPubWorldBatangBold.ttf";
//import notoSansKR from "../assets/fonts/NotoSansKR-Regular.ttf";
import nanumSquare from "../assets/fonts/NanumSquareR.ttf";
import laundryGothic from "../assets/fonts/LaundryGothicR.ttf";

export const fontOptions = [
  {
    label: "기본 폰트",
    name: "default",
    fontFile: "",
    style: "sans-serif",
  },
  {
    name: "KoPubWorldBatangBold",
    label: "KoPub 바탕",
    fontFile: koPub,
    style: "serif",
  },
  {
    label: "나눔 스퀘어",
    name: "NanumSquare",
    style: "sans-serif",
    fontFile: nanumSquare,
  },
  {
    label: "런드리 고딕",
    name: "LaundryGothic",
    style: "sans-serif",
    fontFile: laundryGothic,
  },
];
