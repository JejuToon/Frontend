/**
 * 설화 요약 텍스트에서 키워드를 추출합니다.
 * 기본적으로 공백/문장 구분자로 분할한 후, 불용어를 제외한 2글자 이상의 단어를 반환합니다.
 */

const stopWords = new Set([
  "이야기",
  "전설",
  "설화",
  "인물",
  "제주",
  "지역",
  "장소",
  "했다",
  "있다",
  "되었다",
  "그리고",
  "그러나",
  "또한",
  "한다",
  "한다는",
  "것이다",
  "그",
  "이",
  "저",
  "것",
  "수",
  "등",
  "등의",
  "및",
  "때문에",
  "위해",
  "대한",
]);

const particles = new Set([
  "은",
  "는",
  "이",
  "가",
  "을",
  "를",
  "에",
  "게",
  "한",
  "에서",
  "에게",
  "으로",
  "로",
  "까지",
  "부터",
  "와",
  "과",
  "하고",
  "랑",
  "도",
  "만",
  "보다",
  "처럼",
  "이다",
  "입니다",
  "인데",
  "있다",
  "되었다",
]);

/**
 * 간단한 형태소 기반 명사 추정: 자주 등장하는 조사나 접미사가 붙은 단어 제거
 * 예: "할망이" → "할망", "돌하르방은" → "돌하르방"
 */
function normalizeWord(word: string): string {
  for (const particle of particles) {
    if (word.endsWith(particle)) {
      return word.slice(0, -particle.length);
    }
  }
  return word;
}

/**
 * 설화 요약 텍스트에서 정제된 키워드를 추출합니다.
 */
export function extractKeywords(summary: string): string[] {
  const wordCounts: Record<string, number> = {};

  const words = summary
    .toLowerCase()
    .split(/[\s,.\-()\n"“”‘’!?·]+/)
    .map(normalizeWord)
    .filter(
      (word) =>
        word.length >= 2 && !stopWords.has(word) && /^[가-힣a-z]+$/i.test(word)
    );

  // 단어 빈도 계산
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  // 빈도 기준 상위 N개 (예: 상위 10개만 추출)
  const sorted = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return sorted;
}
