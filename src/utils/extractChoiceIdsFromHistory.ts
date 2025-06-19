import { TalePage } from "../types/tale"; // 필요 시 경로 수정
import seolmun from "../mocks/scriptInfo";

/**
 * 사용자 history를 기반으로 선택된 choice id들을 추출
 */
export function extractChoiceIdsFromHistory(
  talePages: Record<string, TalePage>,
  history: string[]
): number[] {
  const choiceIds: number[] = [];

  for (let i = 0; i < history.length - 1; i++) {
    const currentPageKey = history[i];
    const nextPageKey = history[i + 1];
    const currentPage = talePages[currentPageKey];

    if (!currentPage?.choices) continue;

    const selected = currentPage.choices.find(
      (choice) => choice.next === nextPageKey
    );
    if (selected) {
      choiceIds.push(selected.id);
    }
  }

  return choiceIds;
}
