import seolmun from "../mocks/scriptInfo";
import { TalePage } from "../mocks/scriptInfo";

export function getTaleReplayPages(
  storyId: string[]
): Record<string, TalePage> {
  const result: Record<string, TalePage> = {};

  for (let i = 0; i < storyId.length; i++) {
    const currentKey = storyId[i];
    const nextKey = storyId[i + 1] ?? "end";

    const original = seolmun[currentKey];

    result[currentKey] = {
      imageUrl: original.imageUrl,
      text: original.text,
      audioUrl: original.audioUrl,
      next: nextKey,
    };
  }

  return result;
}
