import { TTSInfo } from "../constants/ttsInfo";

const titleToEngMap: Record<string, string> = {
  설문대할망: "seolmun",
};

export function parseAudioPath(
  koreanTitle: string,
  ttsIndex: number,
  pageIndex: number
): string {
  const engTitle = titleToEngMap[koreanTitle];
  if (!engTitle) return "";

  const ttsName = TTSInfo[ttsIndex]?.name;
  if (!ttsName) return "";

  return `/assets/audios/${engTitle}/${ttsName}/${engTitle}${pageIndex}.wav`;
}
